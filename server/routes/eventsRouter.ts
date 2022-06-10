import express from 'express';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';
import { addToCalendar, deleteCalendarEvent, updateCalendar } from '../functions/gcal';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Event from '../models/event';
import { AccessLevel, EventObject } from '../functions/types';
import History from '../models/history';
import User from '../models/user';
import { isAuthenticated } from '../functions/auth';

const router = express.Router();

/**
 * GET /events
 *
 * Sends a list of public events
 *
 * Query parameters:
 * - start:      Starting time to get events from (default: Current Day Start)
 *               All times will be rounded to the start of the day before
 *               For example, if start is 5:30pm on 1/15, then the events will
 *               be returned from 00:00:00 UTC on 1/14
 *
 * - end:        Ending time to get events from (default: none)
 *               If both start and end are defined, the count will be ignored.
 *               Instead it will get all events between the start and end times
 *               The same rules will apply to end time. It will round to exactly
 *               23:59:59 the next UTC day.
 */
router.get('/', async (req: Request, res: Response) => {
    const start = Number(req.query.start) || new Date().valueOf();
    const end = Number(req.query.end) || null;

    if (!end) {
        const activities = await Event.find({
            publicEvent: true,
            start: { $gte: dayjs(start).startOf('day').subtract(1, 'day') },
        }).exec();
        res.send(activities);
    } else {
        const activities = await Event.find({
            publicEvent: true,
            start: {
                $gte: dayjs(start).startOf('day').subtract(1, 'day'),
                $lte: dayjs(end).endOf('day').add(1, 'day'),
            },
        }).exec();
        res.send(activities);
    }
});

/**
 * GET /events/reservations
 *
 * Sends a list of reservations
 *
 * Query parameters:
 * - week: Week to get reservations of, should be a UTC date number
 *         This can be any time within the week
 */
router.get('/reservations/:week?', async (req: Request, res: Response) => {
    const week = req.params.week ? dayjs(Number(req.params.week)) : dayjs();
    try {
        const reservations = await Event.find({
            reservation: true,
            start: {
                $gte: week.startOf('week').subtract(1, 'week').valueOf(),
                $lte: week.endOf('week').add(1, 'week').valueOf(),
            },
        });
        res.send(reservations);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Could not get list of reservations');
    }
});

/**
 * GET /events/<id>
 *
 * Gets an event by id
 */
router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const activity = await Event.findOne({ id }).exec();
    if (activity) res.send(activity);
    else sendError(res, 400, 'Invalid event id');
});

/**
 * GET /events/reservations/search/<location>/<start>/<end>
 *
 * Searches for a reservation that is present within a certain time range, in between
 * start and end, which are passed in as UTC millisecond times, as well as the location that
 * in which all events should be searched for
 */
router.get('/reservations/search/:location/:start/:end', async (req: Request, res: Response) => {
    try {
        // Parse the passed in start and end times
        const start = Number.parseInt(req.params.start);
        const end = Number.parseInt(req.params.end);

        // Send bad request error if invalid times
        if (isNaN(start) || isNaN(end)) {
            sendError(res, 400, 'Please enter a valid start and end time.');
            return;
        }

        // Adjust start time to be the start of the hour.
        // For the end time, if it falls exactly on an hour, use that;
        // otherwise, set the end time to the beginning of the next hour.
        const startAdjusted = dayjs(start).startOf('hour').valueOf();
        const endRoundedDown = dayjs(end).startOf('hour').valueOf();
        const endAdjusted = end === endRoundedDown ? end : dayjs(endRoundedDown).add(1, 'hour');

        // Get reservation data that overlaps with the time range
        // If an event ends right on the start time or start right on the end time, it does NOT overlap
        const data = await Event.find({
            reservation: true,
            $or: [
                { $and: [{ start: { $gte: startAdjusted } }, { start: { $lt: endAdjusted } }] },
                { $and: [{ end: { $gt: startAdjusted } }, { end: { $lte: endAdjusted } }] },
                { $and: [{ start: { $lte: startAdjusted } }, { end: { $gte: endAdjusted } }] },
            ],
            location: req.params.location,
        });

        // Send data to user or error
        res.send(data);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error when searching for a reservation.');
    }
});

/**
 * POST /events
 *
 * Creates a new event
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevel.STANDARD)) return;

        // Get user
        const user = await User.findOne({ token: req.headers.authorization.substring(7) });

        // Create unique IDs for history and event
        const historyId = newId();
        const id = newId();

        // Create the event with the IDs and event data
        const newEvent = new Event({
            id,
            eventId: null,
            editorId: user.id,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            noEnd: req.body.noEnd,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
        });

        // If public, add to Google Calendar
        if (req.body.publicEvent) {
            newEvent.eventId = await addToCalendar(newEvent);
        }

        // Create a new history object
        const newHistory = await createHistory(req, newEvent.toObject(), 'events', id, historyId);
        await newHistory.save();

        // Save the event
        await newEvent.save();
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to add new event to database');
    }
});

/**
 * PUT /events/<id>
 *
 * Updates an event
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        // Get ID and find previous event
        const id = req.params.id;
        const prev: EventObject = await Event.findOne({ id }).exec();
        if (!prev) {
            sendError(res, 400, 'Invalid event ID');
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevel.STANDARD, prev.editorId)) return;

        // Get user
        const user = await User.findOne({ token: req.headers.authorization.substring(7) });

        // Create new ID for edit history
        const historyId = newId();

        // Create Event to update
        const toUpdate = {
            id,
            eventId: req.body.eventId,
            editorId: user.id,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            allDay: req.body.allDay,
            noEnd: req.body.noEnd,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
        };

        // Update or create google calendar event
        if (prev.publicEvent && toUpdate.publicEvent) await updateCalendar(req.body, prev.eventId);
        else if (toUpdate.publicEvent) toUpdate.eventId = await addToCalendar(toUpdate);

        // Update event in DB
        await Event.updateOne({ id }, { $set: toUpdate });

        // Create and save history
        const newHistory = await createHistory(req, prev, 'events', id, historyId, false);
        await newHistory.save();

        // Send user success and return
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to update event to database');
    }
});

/**
 * DELETE /events/<id>
 *
 * Deletes an event by id, needs an authorization token that is valid and has user
 */
router.delete('/:id', async (req: Request, res: Response) => {
    // Get the previous event
    const event: EventObject = await Event.findOne({ id: req.params.id });
    if (!event) {
        sendError(res, 400, 'Invalid event ID');
        return;
    }

    // Check if user is authenticated
    if (!isAuthenticated(req, res, AccessLevel.STANDARD, event.editorId)) return;

    // Delete event from Google Calendar, History DB, and Events DB
    if (event.publicEvent) await deleteCalendarEvent(event.eventId);
    const deleteRes = await Event.deleteOne({ id: req.params.id });
    await History.deleteMany({ resource: 'events', editId: req.params.id });

    // Return ok status or error
    if (deleteRes.deletedCount === 1) res.sendStatus(204);
    else sendError(res, 500, 'Could not delete event');
});

export default router;
