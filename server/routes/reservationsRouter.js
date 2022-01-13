const express = require('express');
const dayjs = require('dayjs');
const { sendError } = require('../functions/util');
const Reservation = require('../models/reservation');
const { addReservation, updateReservation } = require('../functions/event-reservations');
const RepeatingReservation = require('../models/repeating-reservation');
const router = express.Router();

/**
 * GET /reservations/repeating
 *
 * Sends a list of repeating reservations that repeat up to and after the given week
 *
 * Query parameters:
 * - week: Week to get reservations of, should be a UTC date number
 *         This can be any time within the week
 */
router.get('/repeating', async (req, res, next) => {
    const week = req.query.week ? dayjs(Number(req.query.week)) : dayjs();
    try {
        const repeatingReservations = await RepeatingReservation.find({
            repeatEnd: { $gte: week.startOf('week').valueOf() },
            start: { $lte: week.endOf('week').valueOf() },
        });
        res.send(repeatingReservations);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Could not get list of repeating reservations');
    }
});

/**
 * GET /reservations/repeating/<id>
 *
 * Gets a repeating reservation by id
 */
router.get('/repeating/:id', async (req, res, next) => {
    const id = req.params.id;
    const repeatingReservation = await RepeatingReservation.findOne({ id }).exec();
    if (repeatingReservation) res.send(repeatingReservation);
    else sendError(res, 400, 'Invalid repeating reservation id');
});

/**
 * GET /reservations
 *
 * Sends a list of reservations
 *
 * Query parameters:
 * - week: Week to get reservations of, should be a UTC date number
 *         This can be any time within the week
 */
router.get('/', async (req, res, next) => {
    const week = req.query.week ? dayjs(Number(req.query.week)) : dayjs();
    try {
        const reservations = await Reservation.find({
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
 * GET /reservations/<id>
 *
 * Gets a reservation by id
 */
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const reservation = await Reservation.findOne({ id }).exec();
    if (reservation) res.send(reservation);
    else sendError(res, 400, 'Invalid reservation id');
});

/**
 * POST /reservations
 *
 * Creates a new reservation
 */
router.post('/', async (req, res, next) => {
    try {
        await addReservation(null, req);
        res.send({ ok: 1 });
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to update event to database');
    }
});

/**
 * PUT /reservations/<id>
 *
 * Updates a reservation
 */
router.put('/:id', async (req, res, next) => {
    try {
        if (req.body.eventId !== null) {
            sendError(res, 400, 'Cannot update a reservation connected to an event. Please edit the event instead.');
            return;
        }

        const updateRes = await updateReservation(req.params.id, req, res);
        if (updateRes === -1) return;
        res.send({ ok: 1 });
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to update event to database');
    }
});

/**
 * GET /reservations/search/<location>/<start>/<end>
 *
 * Searches for a reservation that is present within a certain time range, in between
 * start and end, which are passed in as UTC millisecond times, as well as the location that
 * in which all events should be searched for
 */
router.get('/search/:location/:start/:end', async (req, res, next) => {
    try {
        // Parse the passed in start and end times
        const start = Number.parseInt(req.params.start);
        const end = Number.parseInt(req.params.end);

        // Send bad request error if invalid times
        if (isNaN(start) || isNaN(end)) {
            sendError(res, 400, 'Please enter a valid start and end time.');
            return;
        }

        // Get reservation data
        const resData = await Reservation.find({
            $or: [
                { $and: [{ start: { $gte: start } }, { start: { $lt: end } }] },
                { $and: [{ end: { $gt: start } }, { end: { $lte: end } }] },
                { $and: [{ start: { $lte: start } }, { end: { $gte: end } }] },
            ],
            location: req.params.location,
        });

        // Get repeating reservation data
        // TODO: This is repeated code (technically) with the frontend reservation list component
        const repRaw = await RepeatingReservation.find({
            repeatEnd: { $gt: start },
            location: req.params.location,
        }).exec();
        const week = dayjs(start);
        const repData = repRaw.filter((r) => {
            const repStart = week.day(dayjs(r.start).day()).hour(dayjs(r.start).hour()).valueOf();
            const tempEnd = week.day(dayjs(r.end).day()).hour(dayjs(r.end).hour());
            const repEnd = tempEnd.isBefore(repStart) ? tempEnd.add(1, 'week').valueOf() : tempEnd.valueOf();
            return (
                (repStart >= start && repStart < end) ||
                (repEnd > start && repEnd <= end) ||
                (repStart <= start && repEnd >= end)
            );
        });

        // Send concatenated data
        res.send([...resData, ...repData]);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error when searching for a reservation.');
    }
});

module.exports = router;
