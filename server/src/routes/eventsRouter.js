const express = require('express');
const { addToCalendar, updateCalendar } = require('../functions/gcal');
const { sendError, newId, createNewHistory } = require('../functions/util');
const Event = require('../models/event');
const router = express.Router();

/**
 * GET /events
 *
 * Sends a list of events
 * Query parameters:
 * - Count: Number of events to get (default: 20)
 * - Mode: Strict or round (default: round)
 *         Round will get the count of events and include all events from
 *         the last day, which might exceed count. Strict will not do this and only get count.
 *         This param is ignored if both start and end are defined
 * - Start: Starting time to get events from (default: Current Hour)
 * - End: Ending time to get events from (default: none)
 *        If both start and end are defined, the count will be ignored.
 *        Instead it will get all events between the start and end times
 */
router.get('/', async (req, res, next) => {
    // TODO: Apply the other filters lol
    const events = await Event.find({});
    res.send(events);
});

/**
 * GET /events/<id>
 *
 * Gets an event by id
 */
router.get('/:id', async (req, res, next) => {
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
router.post('/', async (req, res, next) => {
    const historyId = newId();
    const id = newId();
    const eventId = await addToCalendar(req.body);

    const newEvent = new Event({
        id,
        eventId,
        type: req.body.type,
        name: req.body.name,
        club: req.body.club,
        description: req.body.description,
        start: Number(req.body.start),
        end: Number(req.body.end),
        history: [historyId],
    });
    const newHistory = createNewHistory(req, newEvent, 'events', id, historyId);

    const eventRes = await newEvent.save();
    const historyRes = await newHistory.save();
    if (eventRes === newEvent && historyRes === newHistory) res.send({ ok: 1 });
    else sendError(res, 500, 'Unable to add new event to database');
});

/**
 * PUT /events/<id>
 */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const prev = await Event.findOne({ id }).exec();
    if (!prev) {
        sendError(res, 400, "Invalid event ID");
        return;
    }

    const historyId = newId();
    const newHistory = createNewHistory(req, prev, 'events', id, historyId, false);
    const calendarRes = await updateCalendar(req.body, prev.eventId);
    const eventRes = await Event.updateOne(
        { id },
        {
            $set: {
                type: req.body.type,
                name: req.body.name,
                club: req.body.club,
                description: req.body.description,
                start: Number(req.body.start),
                end: Number(req.body.end),
                history: [...req.body.history, historyId],
            },
        }
    );
    const historyRes = await newHistory.save();
    
    if (calendarRes === 1 && eventRes.n === 1 && historyRes === newHistory) res.send({ ok: 1 });
    else sendError(res, 500, 'Unable to update event in database.')
});

module.exports = router;
