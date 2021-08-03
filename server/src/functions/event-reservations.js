const dayjs = require('dayjs');
const { Request } = require('express');
const Reservation = require('../models/reservation');
const { newId } = require('./util');

/**
 * Adds a reservation from an event with a set location
 *
 * @param {string} id ID of the relevent event
 * @param {Request} req Express request object
 * @returns {Promise<string>} ID of the reservation
 */
async function addReservationFromEvent(id, req) {
    const body = req.body;
    if (body.location === 'none' || body.start === body.end) return null;
    const startTime = body.allDay ? dayjs(body.start).startOf('day').valueOf() : body.start;
    const endTime = body.allDay ? dayjs(body.start).endOf('day').valueOf() : body.end;
    return addReservation(id, startTime, endTime, req);
}

/**
 * Creates a new reservation and adds it to the reservations db.
 * This only works in increments of hours!!! Minutes and seconds will be IGNORED.
 * Therefore, if your event is from 1:30-2:30pm, the room will be reserved from 1pm to 3pm.
 *
 * @param {string} [eventId] ID of the event this reservation is attributed to
 * @param {number} start Start time of the reservation
 * @param {number} end End time of the reservation
 * @param {Request} req Express request object
 * @returns {Promise<string>} ID of the reservation
 */
async function addReservation(eventId, start, end, req) {
    const roundedStart = dayjs(start).startOf('hour').valueOf();
    const roundedEnd = dayjs(end).startOf('hour');
    const fixedEnd = roundedEnd.isSame(dayjs(end), 'minute')
        ? roundedEnd.valueOf()
        : roundedEnd.add(1, 'hour').valueOf();
    const id = newId();
    const history = eventId ? null : [newId()];

    const newReservation = new Reservation({
        id,
        eventId,
        name: req.body.name,
        club: req.body.club,
        description: req.body.description,
        start: roundedStart,
        end: fixedEnd,
        location: req.body.location,
        history,
    });

    const newHistory = history ? createNewHistory(req, newReservation, 'reservations', id, history[0]) : null;
    const reservationRes = await newReservation.save();
    const historyRes = newHistory ? newHistory.save() : null;
    if (reservationRes === newReservation && newHistory === historyRes) return eventId;
    throw new Error('Could not add reservation to the database');
}

module.exports = { addReservationFromEvent };
