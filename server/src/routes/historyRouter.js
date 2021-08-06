const express = require('express');
const { sendError } = require('../functions/util');
const History = require('../models/history');
const Event = require('../models/event');
const Club = require('../models/club');
const Volunteering = require('../models/volunteering');
const Reservation = require('../models/reservation');
const router = express.Router();

/**
 * GET /history
 *
 * Sends a list of the past 50 edits made, from the specified ID
 * The list will be retrieved in backwards cronological order
 *
 * Query parameters:
 * - start: ID of the first element in the list that is being retrieved
 *          The edits will be sorted in reverse cronological order and
 *          the 50 edits preceeding the element given will be returned
 *          If null, will return the last 50 edits.
 */
router.get('/', async (req, res, next) => {
    if (req.query.start) {
        const prev = await History.findOne({ id: req.query.start });
        if (!prev) {
            sendError(res, 400, 'Invalid start history ID');
            return;
        }
        const history = await History.find({ time: { $lt: prev.time } })
            .sort({ time: -1, _id: 1 })
            .limit(50)
            .exec();
        res.send(history);
    } else {
        const history = await History.find({}).sort({ time: -1, _id: 1 }).limit(50).exec();
        res.send(history);
    }
});

/**
 * GET /history/<resource>/<id>
 *
 * Gets the entire history of a single resource, given the
 * resource and id in the request parameters
 */
router.get('/:resource/:id', async (req, res, next) => {
    const id = req.params.id;

    let resourceObj = null;
    if (req.params.resource === 'events') resourceObj = await Event.findOne({ id });
    else if (req.params.resource === 'clubs') resourceObj = await Club.findOne({ id });
    else if (req.params.resource === 'volunteering') resourceObj = await Volunteering.findOne({ id });
    else if (req.params.resource === 'reservations') resourceObj = await Reservation.findOne({ id });
    else {
        sendError(res, 400, 'Invalid resource value. Expects one of: [events, clubs, volunteering, reservations]');
        return;
    }

    if (!resourceObj) {
        sendError(res, 400, 'Invalid resource ID.');
        return;
    }

    const history = await History.find({ id: { $in: resourceObj.history } });
    if (history) res.send({ history, name: resourceObj.name });
    else sendError(res, 500, 'Could not fetch history list for the given resource');
});

module.exports = router;
