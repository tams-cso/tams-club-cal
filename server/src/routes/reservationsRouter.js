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
    const week = dayjs(req.query.week) || dayjs();
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
    const week = dayjs(req.query.week) || dayjs();
    try {
        const reservations = await Reservation.find({
            start: { $gte: week.startOf('week').valueOf(), $lte: week.endOf('week').valueOf() },
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

module.exports = router;
