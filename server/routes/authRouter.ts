import express from 'express';
import type { Request, Response } from 'express';
import { verifyToken, upsertUser, isAdmin } from '../functions/auth';
import { getIp, sendError } from '../functions/util';
import User from '../models/user';

const router = express.Router();

/**
 * GET /auth/ip
 *
 * Returns the client's IP address. Will use x-real-ip if avaliable.
 * If not, simply just uses 'req.ip'.
 */
router.get('/ip', (req: Request, res: Response) => {
    res.send({ ip: getIp(req) });
});

/**
 * GET /auth/user/<token>
 *
 * Sends the user email and name to the client given the token.
 * Used to display the logged in user on the edit pages.
 */
router.get('/user/:token', async (req: Request, res: Response) => {
    if (!req.params.token) {
        sendError(res, 400, 'Missing token parameter');
        return;
    }
    const user = await User.findOne({ token: req.params.token }).exec();
    if (user) res.send({ email: user.email, name: user.name });
    else sendError(res, 400, 'User not found in database');
});

/**
 * GET /auth/user/id/<id>
 *
 * Sends the user name given their ID.
 * Used to find the user from the ID when showing edit history.
 */
router.get('/user/id/:id', async (req: Request, res: Response) => {
    const user = await User.findOne({ id: req.params.id });
    if (user) res.send({ name: user.name });
    else sendError(res, 400, 'User not found in database with that ID');
});

/**
 * POST /auth
 *
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 */
router.post('/', async (req: Request, res: Response) => {
    if (!req.body.token) {
        sendError(res, 400, 'Missing token in body');
        return;
    }
    const user = await User.findOne({ token: req.body.token }).exec();
    if (user) res.send({ loggedIn: true });
    else res.send({ loggedIn: false });
});

/**
 * POST /auth/login
 *
 * Recieve the Oauth2 sign in credentials and do a token exchange
 * to either return an auth code or an error
 */
router.post('/login', async (req: Request, res: Response) => {
    let error = '';
    // Verify credentials
    const payload = await verifyToken(req.body['credential']);
    if (payload !== null) {
        // Add or check for user in database
        const newToken = await upsertUser(payload);
        if (newToken !== null) {
            // Add token to redirect querystring and redirect user
            res.redirect(`${process.env.ORIGIN}/auth?token=${newToken}`);
            return;
        } else error = 'newToken';
    } else error = 'payload';

    // Redirect to error if failed verification
    res.redirect(`${process.env.ORIGIN}/auth?error=${error}`);
});

/**
 * POST /auth/admin
 *
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 */
router.post('/admin', async (req: Request, res: Response) => {
    if (!req.body.token) {
        sendError(res, 400, 'Missing token in body');
        return;
    }
    if (await isAdmin(req.body.token)) res.send({ admin: true });
    else res.send({ admin: false });
});

export default router;
