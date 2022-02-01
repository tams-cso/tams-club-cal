import express from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../functions/util';
import { parseEditor } from '../functions/edit-history';
import History from '../models/history';
import Club from '../models/club';
import Volunteering from '../models/volunteering';
import { HistoryObject } from '../functions/types';
import Event from '../models/event';
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
router.get('/', async (req: Request, res: Response) => {
    let history = null;
    if (req.query.start) {
        const prev = await History.findOne({ id: req.query.start });
        if (!prev) {
            sendError(res, 400, 'Invalid start history ID');
            return;
        }
        history = await History.find({ time: { $lt: prev.time } })
            .sort({ time: -1, _id: 1 })
            .limit(50)
            .exec();
    } else {
        history = await History.find({}).sort({ time: -1, _id: 1 }).limit(50).exec();
    }

    const sortedHistory = history.sort((a: HistoryObject, b: HistoryObject) => b.time - a.time);
    const dataList = await Promise.all(
        sortedHistory.map(async (h: HistoryObject) => {
            let resourceObj = null;
            if (h.resource === 'events') resourceObj = await Event.findOne({ id: h.editId });
            else if (h.resource === 'clubs') resourceObj = await Club.findOne({ id: h.editId });
            else if (h.resource === 'volunteering') resourceObj = await Volunteering.findOne({ id: h.editId });
            const name = !resourceObj ? 'N/A' : resourceObj.name;
            const first = !resourceObj ? false : resourceObj.history[0] === h.id;
            const editor = await parseEditor(h.editor);
            return { name, editor, first };
        })
    );
    res.send({ historyList: sortedHistory, dataList });
});

/**
 * GET /history/<resource>/<id>
 *
 * Gets the entire history of a single resource, given the
 * resource and id in the request parameters
 */
router.get('/:resource/:id', async (req: Request, res: Response) => {
    // Get ID from parameters
    const id = req.params.id;

    // Get the resource object based on the passed in resource name
    let resourceObj = null;
    if (req.params.resource === 'events') resourceObj = await Event.findOne({ id });
    else if (req.params.resource === 'clubs') resourceObj = await Club.findOne({ id });
    else if (req.params.resource === 'volunteering') resourceObj = await Volunteering.findOne({ id });
    else {
        sendError(res, 400, 'Invalid resource value. Expects one of: [events, clubs, volunteering, reservations]');
        return;
    }

    // If there is no valid ID defined throw error
    if (!resourceObj) {
        sendError(res, 400, 'Invalid resource ID.');
        return;
    }

    // Otherwise, return the history object based on the ID of the resource
    const history = await History.find({ id: { $in: resourceObj.history } });
    if (history) res.send({ history, name: resourceObj.name });
    else sendError(res, 500, 'Could not fetch history list for the given resource');
});

export default router;
