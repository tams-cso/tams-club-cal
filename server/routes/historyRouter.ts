import express from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../functions/util';
import History from '../models/history';
import Club from '../models/club';
import Volunteering from '../models/volunteering';
import Event from '../models/event';
import User from '../models/user';
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

    // TODO: Do we need to do this sort or can it be ignored because we already sorted it before?
    const sortedHistory = history.sort((a: HistoryObject, b: HistoryObject) => b.time - a.time);

    // Fetch the names of the items in the history list
    // Also fetch the names of the editors
    const dataList = await Promise.all(
        sortedHistory.map(async (h: HistoryObject) => {
            let resourceObj = null;
            if (h.resource === 'events') resourceObj = await Event.findOne({ id: h.resourceId });
            else if (h.resource === 'clubs') resourceObj = await Club.findOne({ id: h.resourceId });
            else if (h.resource === 'volunteering') resourceObj = await Volunteering.findOne({ id: h.resourceId });
            const name = !resourceObj ? 'N/A' : resourceObj.name;
            const editorRes = h.editorId ? await User.findOne({ id: h.editorId }) : null;
            return { name, editor: editorRes ? editorRes.name : 'N/A' };
        })
    );

    // Send the final 2 lists to the user
    // TODO: Add something here to tell the frontend if there are more elements in the list
    // (though this might not needed because there are thousands of history entries)
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
    // This also checks to make sure the resource param is valid
    let resourceObj = null;
    if (req.params.resource === 'events') resourceObj = await Event.findOne({ id });
    else if (req.params.resource === 'clubs') resourceObj = await Club.findOne({ id });
    else if (req.params.resource === 'volunteering') resourceObj = await Volunteering.findOne({ id });
    else {
        sendError(res, 400, 'Invalid resource value. Expects one of: [events, clubs, volunteering, reservations]');
        return;
    }

    // If the id is invalid for the given resource, throw error
    // This means that the resource with such an id does not exist
    if (!resourceObj) {
        sendError(res, 400, 'Invalid resource ID.');
        return;
    }

    // Get the history object and the list of editor names
    // If invalid, return error
    const history = await History.find({ resource: req.params.resource, resourceId: resourceObj.id }).exec();
    if (history) {
        // Sort history object
        const sortedHistory = history.sort((a, b) => b.time - a.time);

        // Fetch the names of the items in the history list
        // Also fetch the names of the editors
        // TODO: (maybe) Create some sort of map for editors because honestly the editor of a resource
        // for most are only going to be admins or the person who made it. This would reduce
        const editorList = await Promise.all(
            sortedHistory.map(async (h: HistoryObject) => {
                const editorRes = h.editorId ? await User.findOne({ id: h.editorId }) : null;
                return editorRes ? editorRes.name : 'N/A';
            })
        );
        res.send({ history: sortedHistory, name: resourceObj.name, editorList });
    } else sendError(res, 500, 'Could not fetch history list for the given resource');
});

export default router;
