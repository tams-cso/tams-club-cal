const express = require('express');
const { sendError } = require('../functions/util');
const { validateHeader } = require('../functions/auth');
const router = express.Router();

const Event = require('../models/event');
const Club = require('../models/club');
const Volunteering = require('../models/volunteering');
const Reservation = require('../models/reservation');
const History = require('../models/history');

/**
 * GET /admin/resoruces/<resource>/<field>/<search>/[page]
 *
 * Will retrieve the list of resources based on the resource, field, and search parameters.
 * If the field is 'all', then the search parameter is ignored.
 * If the page field is defined and the field is 'all', then the function will return
 * the specified page of the resource list.
 */
router.get('/resources/:resource/:field/:search/:page?', async (req, res) => {
    const getAll = req.params.field === 'all';
    const pageLength = 50;
    const page = req.params.page ? parseInt(req.params.page) : 0;

    switch (req.params.resource) {
        case 'events': {
            const events = getAll
                ? await Event.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Event.find({ [req.params.field]: req.params.search });
            res.send(events);
            break;
        }
        case 'clubs': {
            const clubs = getAll
                ? await Club.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Club.find({ [req.params.field]: req.params.search });
            res.send(clubs);
            break;
        }
        case 'volunteering': {
            const volunteering = getAll
                ? await Volunteering.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Volunteering.find({ [req.params.field]: req.params.search });
            res.send(volunteering);
            break;
        }
        case 'reservations': {
            const reservations = getAll
                ? await Reservation.find({})
                      .limit(pageLength)
                      .skip((page || 0) * pageLength)
                      .exec()
                : await Reservation.find({ [req.params.field]: req.params.search });
            res.send(reservations);
            break;
        }
        default:
            sendError(res, 400, 'Invalid resource field!');
            return;
    }
});

/**
 * DELETE /admin/resources/<resource>/<id>
 * 
 * Deletes the given resource by id. This will also delete the related history entries.
 * Additionally, if the resource is an event, then the related reservation will also be deleted.
 */
router.delete('/resources/:resource/:id', async (req, res) => {
    console.log(req.headers);
    console.log(req.params);

    // Check to see if header is there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const validHeader = await validateHeader(req.headers.authorization.substring(7));
        if (validHeader) {
            // If everything is good, delete the resource
            switch (req.params.resource) {
                case 'events': {
                    const event = await Event.findOne({ id: req.params.id });
                    const deleteRes = await Event.deleteOne({ id: req.params.id });
                    if (event.reservationId) await Reservation.deleteOne({ id: event.reservationId });
                    await History.deleteMany({ resource: 'events', id: req.params.id });
                    if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                    else sendError(res, 500, 'Could not delete event');
                    break;
                }
                case 'clubs': {
                    const deleteRes = await Club.deleteOne({ id: req.params.id });
                    await History.deleteMany({ resource: 'clubs', id: req.params.id });
                    if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                    else sendError(res, 500, 'Could not delete club');
                    break;
                }
                case 'volunteering': {
                    const deleteRes = await Volunteering.deleteOne({ id: req.params.id });
                    await History.deleteMany({ resource: 'volunteering', id: req.params.id });
                    if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                    else sendError(res, 500, 'Could not delete volunteering');
                    break;
                }
                case 'reservations': {
                    await Reservation.deleteOne({ id: req.params.id });
                    await History.deleteMany({ resource: 'reservations', id: req.params.id });
                    if (deleteRes.deletedCount === 1) res.send({ ok: 1 });
                    else sendError(res, 500, 'Could not delete reservation');
                    break;
                }
                default:
                    sendError(res, 400, 'Invalid resource field!');
                    return;
            }
        } else {
            sendError(res, 401, 'Invalid authorization token');
        }
    } else {
        sendError(res, 401, 'Missing valid authorization token in header');
        return;
    }
});

module.exports = router;
