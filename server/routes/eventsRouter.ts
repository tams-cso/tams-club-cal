import express from 'express';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Event from '../models/event';
import { AccessLevelEnum } from '../types/AccessLevel';
import History from '../models/history';
import { getUserId, isAuthenticated } from '../functions/auth';
import User from '../models/user';

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
 * GET /events/reservations/room/<room>/[month]
 *
 * Sends a list of reservations for a specific room in a given month
 *
 * Query parameters:
 * - Room:  Name of room to get the event from (event.location)
 * - Month: Month to get reservations of, should be a UTC date number
 *          This can be any time within the month
 */
router.get('/reservations/room/:room/:month?', async (req: Request, res: Response) => {
    const month = req.params.month ? dayjs(Number(req.params.month)) : dayjs();
    try {
        const reservations = await Event.find({
            reservation: true,
            location: req.params.room,
            start: {
                $gte: month.startOf('month').subtract(1, 'week').valueOf(),
                $lte: month.endOf('month').add(1, 'week').valueOf(),
            },
        });
        res.send(reservations);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Could not get list of reservations');
    }
});

/**
 * GET /events/id/<id>
 *
 * Gets an event by id
 */
router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const event = await Event.findOne({ id }).exec();
    if (event) res.send(event);
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

        // Get reservation data that overlaps with the time range
        // If an event ends right on the start time or start right on the end time, it does NOT overlap
        const data = await Event.find({
            reservation: true,
            $or: [
                { $and: [{ start: { $gte: start } }, { start: { $lt: end } }] },
                { $and: [{ end: { $gt: start } }, { end: { $lte: end } }] },
                { $and: [{ start: { $lte: start } }, { end: { $gte: end } }] },
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
 * GET /events/user/<token>
 *
 * Fetches the events for the authenticated user
 */
router.get('/user/:token', async (req: Request, res: Response) => {
    try {
        // Fetch the user's events
        const user = await User.findOne({ token: req.params.token });
        if (!user) {
            sendError(res, 400, 'Invalid user token');
            return;
        }
        const data = await Event.find({ editorId: user.id }).sort({ start: -1 }).exec();

        // Send data to user or error
        res.send(data);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error when searching for events by a user.');
    }
});

/**
 * POST /events
 *
 * Creates a new event
 *
 * req.body.repeatsUntil stores the end date of the repeating events (inclusive)
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevelEnum.STANDARD)) return;

        // Create/get IDs
        const userId = await getUserId(req);
        const id = newId();

        // Calculate repeating status
        const repeatingId = req.body.repeatingId ? newId() : null;

        // Create the event with the IDs and event data
        const eventObj = {
            id,
            eventId: null,
            editorId: userId,
            name: req.body.name,
            type: req.body.type,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            noEnd: req.body.noEnd,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
            repeatingId,
            repeatsUntil: req.body.repeatsUntil,
        };

        // If repeating event, repeatingId will be not be null
        if (repeatingId) {
            // Generate the repeating events
            const lastDay = dayjs(req.body.repeatsUntil).add(1, 'day');
            let currStart = dayjs(req.body.start).add(1, 'week');
            let currEnd = dayjs(req.body.end).add(1, 'week');
            const eventList = [eventObj];

            // Create events until the last day
            while (currStart.isBefore(lastDay, 'day')) {
                eventList.push({ ...eventObj, id: newId(), start: currStart.valueOf(), end: currEnd.valueOf() });
                currStart = currStart.add(1, 'week');
                currEnd = currEnd.add(1, 'week');
            }

            // Create a list of history objects
            const historyList = eventList.map((e) => createHistory(req, e, 'events', e.id, userId, newId()));
            await History.insertMany(historyList);

            // Insert all events
            await Event.insertMany(eventList);
            res.sendStatus(204);
            return;
        }

        // If not repeating, simply create a new event
        const newEvent = new Event(eventObj);

        // Create a new history object
        const newHistory = createHistory(req, newEvent.toObject(), 'events', id, userId, newId());
        if (newHistory) await newHistory.save();

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
 *
 * req.body.editAll is true if this will edit all events
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
        if (!isAuthenticated(req, res, AccessLevelEnum.STANDARD, prev.editorId)) return;

        // Get user
        const userId = await getUserId(req);

        // Check if we are editing all events
        if (req.body.editAll) {
            // Retrieve all repeating events from database
            const repeatingEvents = await Event.find({ repeatingId: req.body.repeatingId });

            // Calculate the date change
            const startChange = dayjs(req.body.start).diff(prev.start);
            const endChange = dayjs(req.body.end).diff(prev.end);

            // TODO: Check to make sure repeatsUntil is still correct and update if not

            // Create the edit object
            const toUpdate = {
                editorId: userId,
                name: req.body.name,
                type: req.body.type,
                club: req.body.club,
                description: req.body.description,
                location: req.body.location,
                noEnd: req.body.noEnd,
                publicEvent: req.body.publicEvent,
                reservation: req.body.reservation,
                repeatsUntil: req.body.repeatsUntil,
            };

            // Add new history entries
            const historyList = repeatingEvents.map((event) => {
                const toUpdateFull: EventObject = {
                    ...toUpdate,
                    id: event.id,
                    eventId: event.eventId,
                    repeatingId: event.repeatingId,
                    start: event.start + startChange,
                    end: event.end + endChange,
                };
                return createHistory(null, event, 'events', event.id, userId, newId(), false, toUpdateFull);
            });
            await History.insertMany(historyList);

            // Update events in DB
            await Event.updateMany(
                { repeatingId: req.body.repeatingId },
                { $set: toUpdate, $inc: { start: startChange, end: endChange } }
            );

            // Send user success and return
            res.sendStatus(204);
            return;
        }

        // Otherwise, if we are only editing one event
        // If it was previously repeating, it no longer is due to this update (repeatingId = null)
        // Create Event to update
        const toUpdate = {
            id,
            eventId: req.body.eventId,
            editorId: userId,
            name: req.body.name,
            type: req.body.type,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            noEnd: req.body.noEnd,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
            repeatingId: null,
            repeatsUntil: null,
        };

        // Update event in DB
        await Event.updateOne({ id }, { $set: toUpdate });

        // Create and save history
        const newHistory = createHistory(req, prev, 'events', id, userId, newId(), false);
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
    try {
        // Get the previous event
        const event: EventObject = await Event.findOne({ id: req.params.id });
        if (!event) {
            sendError(res, 400, 'Invalid event ID');
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevelEnum.STANDARD, event.editorId)) return;

        // Delete event from Google Calendar, History DB, and Events DB
        const deleteRes = await Event.deleteOne({ id: req.params.id });
        await History.deleteMany({ resource: 'events', editId: req.params.id });

        // Return ok status or error
        if (deleteRes.deletedCount === 1) res.sendStatus(204);
        else sendError(res, 500, 'Could not delete event');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

/**
 * DELETE /events/repeating/<repeatingId>
 */
router.delete('/repeating/:id', async (req: Request, res: Response) => {
    try {
        // Get the previous event
        const eventList = await Event.find({ repeatingId: req.params.id });
        if (eventList.length === 0) {
            sendError(res, 400, 'Invalid repeating ID');
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevelEnum.STANDARD, eventList[0].editorId)) return;

        // Delete all events from History DB and Events DB
        const idList = eventList.map((e) => e.id);
        await History.deleteMany({ resource: 'events', editId: { $in: idList } });
        const deleteRes = await Event.deleteMany({ repeatingId: req.params.id });

        // Return ok status or error
        if (deleteRes.deletedCount > 0) res.sendStatus(204);
        else sendError(res, 500, 'Could not delete event');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

export default router;
