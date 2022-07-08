import express from 'express';
import type { Request, Response } from 'express';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Volunteering from '../models/volunteering';
import { isAuthenticated } from '../functions/auth';
import { AccessLevelEnum } from '../types/AccessLevel';
import History from '../models/history';
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
    });
    const newHistory = await createHistory(req, newVolunteering.toObject(), 'volunteering', id, historyId);

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
            },
        }
    );
    const historyRes = await newHistory.save();

    if (volunteeringRes.acknowledged && historyRes === newHistory) res.sendStatus(204);
    else sendError(res, 500, 'Unable to update volunteering opportunity in database.');
});

/**
 * DELETE /volunteering/<id>
 */
router.delete('/:id', async (req: Request, res: Response) => {
    // Check for authentication and access level
    if (!isAuthenticated(req, res, AccessLevelEnum.CLUBS)) return;

    // Delete volunteering and history
    const deleteRes = await Volunteering.deleteOne({ id: req.params.id });
    await History.deleteMany({ resource: 'volunteering', editId: req.params.id });

    // Return ok or error
    if (deleteRes.deletedCount === 1) res.status(204);
    else sendError(res, 500, 'Could not delete volunteering');
});

export default router;
