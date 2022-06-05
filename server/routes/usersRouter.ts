import express from 'express';
import type { Request, Response } from 'express';
import User from '../models/user';
import { sendError } from '../functions/util';

const router = express.Router();

/**
 * GET /users?page=<page_num>&limit=<items_per_page>&sort=<sorting_method>&reverse=<true_if_sort_reverse>&filter=<filter>
 *
 * Will retrieve the list of users for the user display table.
 */
router.get('/', async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const sort = req.query.sort ? { [req.query.sort as string]: req.query.reverse === 'true' ? -1 : 1 } : null;
    const filterData = req.query.filter ? JSON.parse(req.query.filter as string) : null;
    const filter = filterData ? { [filterData.columnField]: new RegExp(`.*${filterData.value}.*`, 'i') } : {};

    const users = await User.paginate(filter, { lean: true, leanWithId: false, page, limit, sort });
    res.send(users);
});

/**
 * GET /users/<token>
 *
 * Sends the user info to the client given the token.
 */
router.get('/:token', async (req: Request, res: Response) => {
    if (!req.params.token) {
        sendError(res, 400, 'Missing token parameter');
        return;
    }
    const user = await User.findOne({ token: req.params.token }).exec();
    if (user) res.send({ id: user.id, email: user.email, name: user.name, level: user.level });
    else sendError(res, 400, 'User not found in database');
});

/**
 * GET /users/id/<id>
 *
 * Sends the user name given their ID.
 * Used to find the user from the ID when showing edit history.
 */
router.get('/id/:id', async (req: Request, res: Response) => {
    const user = await User.findOne({ id: req.params.id });
    if (user) res.send({ name: user.name });
    else sendError(res, 400, 'User not found in database with that ID');
});

/**
 * PUT /users/level/<id>
 *
 * Updates a user's level
 */
router.put('/level/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const prev = await User.findOne({ id }).exec();
    if (!prev) {
        sendError(res, 400, 'Invalid user ID');
        return;
    }

    const updateRes = await User.updateOne({ id }, { $set: { level: req.body.level } });
    if (updateRes.acknowledged) res.sendStatus(204);
    else sendError(res, 500, 'Unable to update user status');
});

export default router;
