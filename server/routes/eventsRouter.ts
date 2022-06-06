import express from 'express';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';
import { addRecurringToCalendar, addToCalendar, deleteCalendarEvent, updateCalendar } from '../functions/gcal';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Event from '../models/event';
import { AccessLevel, EventObject, RepeatingStatus } from '../functions/types';
import { addRepeatingEvents, updateRepeatingEvents } from '../functions/repeating-events';
import { isAuthenticated } from '../functions/auth';
import History from '../models/history';
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

        const user = await User.findOne({ token: req.headers.authorization.substring(7) });
        console.log(user.id);

        // Create unique IDs for history and event
        const historyId = newId();
        const id = newId();

        // Parse repeating status
        const repeats = Number(req.body.repeats);

        // Create the event with the IDs and event data
        const newEvent = new Event({
            id,
            eventId: null,
            editorId: user.id,
            type: req.body.type,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            allDay: req.body.allDay,
            noEnd: req.body.noEnd,
            repeats,
            repeatsUntil: Number(req.body.repeatsUntil),
            repeatOriginId: repeats === RepeatingStatus.NONE ? null : id,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
        });

        // Create repeating events if the event is repeating
        let repeatingList = [];
        if (req.body.repeats !== RepeatingStatus.NONE) {
            repeatingList = await addRepeatingEvents(id, newEvent);
        }

        // If public, add to Google Calendar
        if (req.body.publicEvent) {
            if (req.body.repeats !== RepeatingStatus.NONE) {
                // If repeating, add to calendar and set the eventId to the first of the IDs
                const ids = await addRecurringToCalendar(newEvent);
                for (let i = 1; i < ids.length; i++) {
                    repeatingList[i - 1].eventId = ids[i];
                }
                newEvent.eventId = ids[0];
            } else {
                // Otherwise if not repeating, simply add the event to the calendar!
                newEvent.eventId = await addToCalendar(newEvent);
            }
        }

        // Create a new history object
        const newHistory = await createHistory(req, newEvent.toObject(), 'events', id, historyId);
        await newHistory.save();

        // Save the event and possibly repeating events then send 204 to user
        await newEvent.save();
        await Event.insertMany(repeatingList);
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

        // Create new ID for edit history
        const historyId = newId();

        // Extract info from req.body
        const repeats = Number(req.body.repeats);

        // Get editor information

        // Create Event to update
        const toUpdate = {
            id,
            eventId: req.body.eventId,
            editorId: prev.editorId,
            type: req.body.type,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            start: Number(req.body.start),
            end: Number(req.body.end),
            location: req.body.location,
            allDay: req.body.allDay,
            noEnd: req.body.noEnd,
            repeats,
            repeatsUntil: Number(req.body.repeatsUntil),
            repeatOriginId: req.body.repeatOriginId,
            publicEvent: req.body.publicEvent,
            reservation: req.body.reservation,
        };

        // Check if any time has changed
        const timeChanged =
            prev.start !== toUpdate.start || prev.end !== toUpdate.end || prev.allDay !== toUpdate.allDay;

        // ##### Logging used for debugging the next giant section #####################################################################
        //
        // console.log(prev);
        // console.log(toUpdate);
        // if (repeats !== RepeatingStatus.NONE && toUpdate.repeatOriginId !== id && prev.repeats !== RepeatingStatus.NONE)
        //     console.log(1);
        // else {
        //     if (prev.publicEvent && !toUpdate.publicEvent) console.log(2);
        //     if (
        //         (prev.repeats !== RepeatingStatus.NONE && prev.repeats !== repeats) ||
        //         (timeChanged && repeats !== RepeatingStatus.NONE) ||
        //         (prev.repeats !== RepeatingStatus.NONE &&
        //             prev.repeats === repeats &&
        //             toUpdate.repeatsUntil != prev.repeatsUntil)
        //     )
        //         console.log(3);
        //     if (repeats === RepeatingStatus.NONE) console.log(4);
        //     else if (
        //         prev.repeats !== repeats ||
        //         timeChanged ||
        //         (prev.repeats === repeats && toUpdate.repeatsUntil != prev.repeatsUntil)
        //     )
        //         console.log(5);
        //     else console.log(6);
        // }
        //
        // #############################################################################################################################

        // ### Do things based on the repeating status of the updated event and the previous event ###
        // Blocks follow this order:
        //      1. Instance of a repeating event (delete instance, create a new event, and RETURN)
        //      2. Event is no longer public (delete calendar event)
        //      3. "repeats" field changed from WEEKLY/MONTHLY OR START/END time has changed for the event OR "repeatUntil" time is LATER than previous (delete repeating events)
        //      4. Event does not currently repeat (update one, create history, and RETURN)
        //      5. Completely new repeated events need to be made because 3 and IS NOW repeating OR "repeatUntil" time is LATER than previous (create new repeating instances, and RETURN)
        //      6. Default case: event is repeating but "repeats" and "repeatUntil" has not changed (update event and repetitions, RETURN)

        // (1) Case that the event is an INSTANCE of a repeating event -> DETACH IT FROM THE ORIGINAL EVENT!
        // Will return after block
        if (
            repeats !== RepeatingStatus.NONE &&
            toUpdate.repeatOriginId !== id &&
            prev.repeats !== RepeatingStatus.NONE
        ) {
            // Delete instance from calendar if it was on the calendar
            if (prev.publicEvent) await deleteCalendarEvent(prev.eventId);

            // Create the fields that need updating
            const newFields = {
                eventId: null,
                repeats: RepeatingStatus.NONE,
                repeatsUntil: 0,
                repeatOriginId: null,
            };

            // Create pseudo object to update history/calendar
            const newEvent = { ...toUpdate, ...newFields };

            // Create new history object
            const newHistory = await createHistory(req, newEvent, 'events', id, historyId, true);

            // If public, add to calendar
            if (toUpdate.publicEvent) newFields.eventId = await addToCalendar(newEvent);

            // Save changes and send success to user
            // Exit router when done as nothing else needs to be done
            await Event.updateOne({ id }, { $set: newEvent });
            await newHistory.save();
            res.sendStatus(204);
            return;
        }

        // (2) Case that the event WAS public but is no longer public => delete calendar event
        // Will NOT return after block
        if (prev.publicEvent && !toUpdate.publicEvent) {
            await deleteCalendarEvent(prev.eventId);
            toUpdate.eventId = null;
        }

        // (3) Case that the event was repeating and has changed OR time changed on repeating event OR repeatsUntil changed => delete previous repeating events
        // This block can only be executed if the event is the ORIGINAL REPEATING EVENT
        // Will NOT return after block
        if (
            (prev.repeats !== RepeatingStatus.NONE && prev.repeats !== repeats) ||
            (timeChanged && repeats !== RepeatingStatus.NONE) ||
            (prev.repeats !== RepeatingStatus.NONE &&
                prev.repeats === repeats &&
                toUpdate.repeatsUntil != prev.repeatsUntil)
        ) {
            // Delete repeating events from database
            await Event.deleteMany({
                repeatOriginId: id,
                id: { $ne: id },
            }).exec();

            // Also delete Google Calendar repeating event if prev was public and wasn't caught by (2)
            if (prev.publicEvent && toUpdate.publicEvent) await deleteCalendarEvent(prev.eventId);
        }

        // (4) Case that the event DOES NOT CURRENTLY REPEAT
        // This will apply to all non-repeating events
        // Will return after block
        if (repeats === RepeatingStatus.NONE) {
            // Update or create google calendar event
            // Note that if the event was previously repeating, the calendar event will no longer exist and needs to be created
            if (prev.publicEvent && toUpdate.publicEvent && prev.repeats === RepeatingStatus.NONE)
                await updateCalendar(req.body, prev.eventId);
            else if (toUpdate.publicEvent) toUpdate.eventId = await addToCalendar(toUpdate);

            // Update event in DB
            await Event.updateOne({ id }, { $set: toUpdate });

            // Create and save history
            const newHistory = await createHistory(req, prev, 'events', id, historyId, false);
            await newHistory.save();

            // Send user success and return
            res.sendStatus(204);
            return;
        }

        // (5) Case that (3) deleted repeating events OR is now repeating when it wasn't before => updates current event, creates new repeating instances
        // Covers case where Repeat pattern changed, event was set to repeating, Start/end time changed, OR repeat until time changed
        // Note that (4) catches all cases where "repeats" was set to NONE
        // Will return after block
        if (
            prev.repeats !== repeats ||
            timeChanged ||
            (prev.repeats === repeats && toUpdate.repeatsUntil != prev.repeatsUntil)
        ) {
            // Create new repeating events
            const repeatingList = await addRepeatingEvents(id, toUpdate);
            toUpdate.repeatOriginId = toUpdate.id;

            // If public, add to Google Calendar
            if (toUpdate.publicEvent) {
                const ids = await addRecurringToCalendar(toUpdate);
                for (let i = 1; i < ids.length; i++) {
                    repeatingList[i - 1].eventId = ids[i];
                }
                toUpdate.eventId = ids[0];
            }

            // Update event and upload repeating to DB
            await Event.updateOne({ id }, { $set: toUpdate });
            await Event.insertMany(repeatingList);

            // Create and save history
            const newHistory = await createHistory(req, prev, 'events', id, historyId, false);
            await newHistory.save();

            // Send success
            res.sendStatus(204);
            return;
        }

        // (6) Reaching this block means that the event is repeating but neither "repeats" nor "repeatUntil" has changed
        // Again, only the original repeating event object can reach this block
        // Simply update the event and its repetitions

        // If previously public AND currently public, update calendar
        // Otherwise, if newly public, create calendar event
        if (prev.publicEvent && toUpdate.publicEvent) updateCalendar(toUpdate, toUpdate.eventId);
        else if (toUpdate.publicEvent) toUpdate.eventId = addToCalendar(toUpdate);

        // Update events + repeating events
        await updateRepeatingEvents(id, toUpdate);

        // Create and save history
        const newHistory = await createHistory(req, prev, 'events', id, historyId, false);
        await newHistory.save();
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

    // Also delete any repeating events if it is the original repeating event
    // TODO: Get rid of!!!
    if (event.repeats !== RepeatingStatus.NONE && event.id === event.repeatOriginId)
        await Event.deleteMany({ repeatOriginId: req.params.id });

    // Return ok status or error
    if (deleteRes.deletedCount === 1) res.sendStatus(204);
    else sendError(res, 500, 'Could not delete event');
});

export default router;
