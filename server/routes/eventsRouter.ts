import express from 'express';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';
import { addToCalendar, updateCalendar } from '../functions/gcal';
import { sendError, newId } from '../functions/util';
import { updateReservation, addReservation, deleteReservation } from '../functions/event-reservations';
import Event from '../models/event';
import { createHistory } from '../functions/edit-history';

const router = express.Router();

/**
 * GET /events
 *
 * Sends a list of events
 *
 * Query parameters:
 * - count:      Number of events to get (default: 30)
 *
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
 *
 * - lastEvent:  Get all elements later than the object with this ID to count.
 *               If defined start/end will be ignored.
 *
 * - firstEvent: Get all elements earlier than the object with this ID to count.
 *               If defined start/end will be ignored. This parameter will be ignored
 *               if the firstEvent parameter is already defined
 */
router.get('/', async (req: Request, res: Response) => {
    const count = Number(req.query.count) || 30;
    const start = Number(req.query.start) || new Date().valueOf();
    const end = Number(req.query.end) || null;
    const firstEvent = req.query.firstEvent || null;
    const lastEvent = req.query.lastEvent || null;

    if (lastEvent) {
        const lastStart = await Event.findOne({ id: lastEvent });
        if (!lastStart) {
            sendError(res, 400, 'Invalid last event ID');
            return;
        }
        const events = await Event.find({ start: { $lte: lastStart.start } });
        const lastIndex = events.findIndex((e) => e.id === lastStart.id);
        const filteredEvents = events.slice(lastIndex + 1);
        res.send(filteredEvents);
    } else if (firstEvent) {
        const firstStart = await Event.findOne({ id: firstEvent });
        if (!firstStart) {
            sendError(res, 400, 'Invalid first event ID');
            return;
        }
        const events = await Event.find({ start: { $gte: firstStart.start } });
        const firstIndex = events.findIndex((e) => e.id === firstStart.id);
        const filteredEvents = events.slice(0, firstIndex);
        res.send(filteredEvents);
    } else if (start) {
        const events = await Event.find({ start: { $gte: dayjs(start).startOf('day').subtract(1, 'day') } })
            .sort({ start: 1, _id: 1 })
            .limit(count)
            .exec();
        res.send(events);
    } else if (!end) {
        const events = await Event.find({ start: { $gte: dayjs(end).endOf('day').add(1, 'day') } })
            .sort({ start: 1, _id: 1 })
            .limit(count)
            .exec();
        res.send(events);
    }
});

/**
 * GET /events/<id>
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
 * POST /events
 *
 * Creates a new event
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        // Create unique IDs for history and event
        const historyId = newId();
        const id = newId();

        // Add event to Google Calendar
        const eventId = await addToCalendar(req.body);

        // Create a reservation if reservationId is set to 1
        const reservationId = req.body.reservationId === 1 ? await addReservation(req, res, id) : null;

        // Create the event with the IDs and event data
        const newEvent = new Event({
            id,
            eventId,
            reservationId,
            type: req.body.type,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            allDay: req.body.allDay,
            history: [historyId],
        });
        const newHistory = await createHistory(req, newEvent, 'events', id, historyId);

        const eventRes = await newEvent.save();
        const historyRes = await newHistory.save();
        if (eventRes === newEvent && historyRes === newHistory) res.send({ ok: 1 });
        else sendError(res, 500, 'Unable to add new event to database');
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
        const id = req.params.id;
        const prev = await Event.findOne({ id }).exec();
        if (!prev) {
            sendError(res, 400, 'Invalid event ID');
            return;
        }

        // Update reservation, delete reservation (resId = -1), or add reservation (resId = 1)
        // TODO: is there any way to make this section look nicer TwT (and not return string | number)
        let reservationRes: string | number;
        if (req.body.reservationId === -1) {
            reservationRes = await deleteReservation(prev.reservationId);
        } else if (prev.reservationId) {
            reservationRes = await updateReservation(prev.reservationId, req, res);
        } else if (req.body.reservationId === 1) {
            reservationRes = await addReservation(req, res, id);
        }
        if (reservationRes === -1) return;

        // Set the reservation ID to null if deleted, or the reservation ID if updated or added
        const reservationId =
            req.body.reservationId === -1 ? null : req.body.reservationId === 1 ? reservationRes : prev.reservationId;

        // Set body resId for history
        req.body.reservationId = reservationId;

        // Update history and calendar
        const historyId = newId();
        const newHistory = await createHistory(req, prev, 'events', id, historyId, false);
        const calendarRes = await updateCalendar(req.body, prev.eventId);

        // Update the event with the IDs and event data
        const eventRes = await Event.updateOne(
            { id },
            {
                $set: {
                    reservationId,
                    type: req.body.type,
                    name: req.body.name,
                    club: req.body.club,
                    description: req.body.description,
                    start: Number(req.body.start),
                    end: Number(req.body.end),
                    location: req.body.location,
                    allDay: req.body.allDay,
                    history: [...req.body.history, historyId],
                },
            }
        );
        const historyRes = await newHistory.save();

        if (calendarRes === 1 && eventRes.acknowledged && historyRes === newHistory) res.send({ ok: 1 });
        else sendError(res, 500, 'Unable to update event in database.');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to update event to database');
    }
});

export default router;
