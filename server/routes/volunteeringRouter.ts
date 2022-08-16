import express from 'express';
import type { Request, Response } from 'express';
import { sendError, newId } from '../functions/util';
import { createHistory } from '../functions/edit-history';
import Volunteering from '../models/volunteering';
import { getUserId, isAuthenticated } from '../functions/auth';
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
    try {
        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevelEnum.CLUBS)) return;

        // Create or get IDs needed
        const id = newId();
        const userId = await getUserId(req);

        const newVolunteering = new Volunteering({
            id,
            name: req.body.name,
            club: req.body.club,
            description: req.body.description,
            filters: req.body.filters,
        });

        const newHistory = createHistory(req, newVolunteering.toObject(), 'volunteering', id, userId, newId());
        if (newHistory) await newHistory.save();

        const volunteeringRes = await newVolunteering.save();
        if (volunteeringRes === newVolunteering) res.sendStatus(204);
        else sendError(res, 500, 'Unable to add new volunteering opportunity to database');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

/**
 * PUT /volunteering/<id>
 */
router.put('/:id', async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!isAuthenticated(req, res, AccessLevelEnum.CLUBS)) return;
        const id = req.params.id;
        const prev = await Volunteering.findOne({ id }).exec();
        if (!prev) {
            sendError(res, 400, 'Invalid volunteering ID');
            return;
        }

        // Get user ID
        const userId = await getUserId(req);

        await Volunteering.updateOne(
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

        const newHistory = createHistory(req, prev, 'volunteering', id, userId, newId(), false);
        if (newHistory) await newHistory.save();

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Unable to update volunteering opportunity in database.');
    }
});

/**
 * DELETE /volunteering/<id>
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        // Check for authentication and access level
        if (!isAuthenticated(req, res, AccessLevelEnum.CLUBS)) return;

        // Delete volunteering and history
        const deleteRes = await Volunteering.deleteOne({ id: req.params.id });
        await History.deleteMany({ resource: 'volunteering', editId: req.params.id });

        // Return ok or error
        if (deleteRes.deletedCount === 1) res.status(204);
        else sendError(res, 500, 'Could not delete volunteering');
    } catch (error) {
        console.error(error);
        sendError(res, 500, 'Internal server error');
    }
});

export default router;
