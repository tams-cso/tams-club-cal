import express from 'express';
import type { Request, Response } from 'express';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Volunteering from '../models/volunteering';
const router = express.Router();

/**
 * GET /volunteering
 *
 * Sends the list of all volunteering opportunities
 */
router.get('/', async (req: Request, res: Response) => {
    const volunteering = await Volunteering.find({});
    res.send(volunteering);
});

/**
 * GET /volunteering/<id>
 *
 * Gets a volunteering opportunity by id
 */
router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const volunteering = await Volunteering.findOne({ id }).exec();
    if (volunteering) res.send(volunteering);
    else sendError(res, 400, 'Invalid volunteering id');
});

/**
 * POST /volunteering
 *
 * Creates a new event
 */
router.post('/', async (req: Request, res: Response) => {
    const historyId = newId();
    const id = newId();

    const newVolunteering = new Volunteering({
        id,
        name: req.body.name,
        club: req.body.club,
        description: req.body.description,
        filters: req.body.filters,
        history: [historyId],
    });
    const newHistory = await createHistory(req, newVolunteering, 'volunteering', id, historyId);

    const volunteeringRes = await newVolunteering.save();
    const historyRes = await newHistory.save();
    if (volunteeringRes === newVolunteering && historyRes === newHistory) res.sendStatus(204);
    else sendError(res, 500, 'Unable to add new volunteering opportunity to database');
});

/**
 * PUT /volunteering/<id>
 */
router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const prev = await Volunteering.findOne({ id }).exec();
    if (!prev) {
        sendError(res, 400, 'Invalid volunteering ID');
        return;
    }

    const historyId = newId();
    const newHistory = await createHistory(req, prev, 'volunteering', id, historyId, false);
    const volunteeringRes = await Volunteering.updateOne(
        { id },
        {
            $set: {
                name: req.body.name,
                club: req.body.club,
                description: req.body.description,
                filters: req.body.filters,
                history: [...req.body.history, historyId],
            },
        }
    );
    const historyRes = await newHistory.save();

    if (volunteeringRes.acknowledged && historyRes === newHistory) res.sendStatus(204);
    else sendError(res, 500, 'Unable to update volunteering opportunity in database.');
});

export default router;
