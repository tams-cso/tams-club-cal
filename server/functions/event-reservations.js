const dayjs = require('dayjs');
const { Request, Response } = require('express');
const Reservation = require('../models/reservation');
const RepeatingReservation = require('../models/repeating-reservation');
const { newId, createNewHistory, sendError } = require('./util');

/**
 * Creates a new reservation and adds it to the reservations db.
 * This only works in increments of hours!!! Minutes and seconds will be IGNORED.
 * Therefore, if your event is from 1:30-2:30pm, the room will be reserved from 1pm to 3pm.
 *
 * @param {string} [eventId] ID of the event this reservation is attributed to
 * @param {Request} req Express request object
 * @returns {Promise<string>} ID of the reservation
 */
async function addReservation(eventId, req) {
    const { start, end } = offsetTime(req);
    const id = newId();
    const history = eventId ? null : [newId()];

    const newReservation = req.body.repeatEnd
        ? new RepeatingReservation({
              id,
              eventId,
              name: req.body.name,
              club: req.body.club,
              description: req.body.description,
              start,
              end,
              location: req.body.location,
              allDay: req.body.allDay,
              repeatEnd: Number(req.body.repeatEnd),
              history,
          })
        : new Reservation({
              id,
              eventId,
              name: req.body.name,
              club: req.body.club,
              description: req.body.description,
              start,
              end,
              location: req.body.location,
              allDay: req.body.allDay,
              history,
          });

    const newHistory = history
        ? await createNewHistory(
              req,
              newReservation,
              req.body.repeatEnd ? 'repeating-reservations' : 'reservations',
              id,
              history[0]
          )
        : null;
    const reservationRes = await newReservation.save();
    const historyRes = newHistory ? await newHistory.save() : null;
    if (reservationRes === newReservation && newHistory === historyRes) return id;
    sendError(res, 500, 'Unable to create reservation for given event');
    return -1;
}

/**
 * Updates a reservation from the reservations db.
 * This only works in increments of hours!!! Minutes and seconds will be IGNORED.
 * Therefore, if your event is from 1:30-2:30pm, the room will be reserved from 1pm to 3pm.
 *
 * @param {string} id ID of the reservation
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @returns {Promise<string>} ID of the reservation
 */
async function updateReservation(id, req, res) {
    const prev = req.body.repeatEnd
        ? await RepeatingReservation.findOne({ id }).exec()
        : await Reservation.findOne({ id }).exec();
    if (!prev) {
        sendError(res, 400, 'Invalid reservation ID');
        return -1;
    }

    const historyId = newId();
    const { start, end } = offsetTime(req);

    const reservationRes = prev.repeatEnd
        ? await RepeatingReservation.updateOne(
              { id },
              {
                  $set: {
                      name: req.body.name,
                      club: req.body.club,
                      description: req.body.description,
                      start,
                      end,
                      location: req.body.location,
                      allDay: req.body.allDay,
                      repeatEnd: Number(req.body.repeatEnd),
                      history: prev.eventId ? null : [...req.body.history, historyId],
                  },
              }
          )
        : await Reservation.updateOne(
              { id },
              {
                  $set: {
                      name: req.body.name,
                      club: req.body.club,
                      description: req.body.description,
                      start,
                      end,
                      location: req.body.location,
                      allDay: req.body.allDay,
                      history: prev.eventId ? null : [...req.body.history, historyId],
                  },
              }
          );

    const newHistory = prev.eventId
        ? null
        : await createNewHistory(
              req,
              prev,
              req.body.repeatEnd ? 'repeating-reservations' : 'reservations',
              id,
              historyId,
              false
          );
    const historyRes = newHistory ? await newHistory.save() : null;
    if (reservationRes.n === 1 && newHistory === historyRes) return id;
    sendError(res, 500, 'Unable to update reservation for given event');
    return -1;
}

/**
 * Deletes a reservation from the reservations db.
 *
 * @param {string} id ID of the reservation to delete
 * @returns {Promise<-1 | 1>} -1 if the reservation was not found, 1 if the reservation was deleted
 */
async function deleteReservation(id) {
    const res = await Reservation.deleteOne({ id }).exec();
    if (res.n === 1) return 1;
    throw new Error('Unable to delete reservation');
}

/**
 * Offsets time to start of hour/end of hour
 * @param {Request} req Express request object
 */
function offsetTime(req) {
    const roundedStart = dayjs(req.body.start).startOf('hour').valueOf();
    const roundedEnd = dayjs(req.body.end).startOf('hour');
    const fixedEnd = roundedEnd.isSame(dayjs(req.body.end), 'minute')
        ? roundedEnd.valueOf()
        : roundedEnd.add(1, 'hour').valueOf();
    return { start: roundedStart, end: fixedEnd };
}

module.exports = { addReservation, updateReservation, deleteReservation };
