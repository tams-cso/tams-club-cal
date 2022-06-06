import express from 'express';
import type { Request, Response } from 'express';
import { verifyToken, upsertUser } from '../functions/auth';
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
 * GET /auth/<token>
 *
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 * This function will also return the user's level if they are logged in.
 */
router.get('/:token', async (req: Request, res: Response) => {
    const user = await User.findOne({ token: req.params.token }).exec();
    if (user) res.send({ loggedIn: true, level: user.level });
    else res.send({ loggedIn: false, level: null });
});

/**
 * POST /auth/login
 *
 * Recieve the Oauth2 sign in credentials and do a token exchange
 * to either return an auth code or an error
 */
router.post('/login', async (req: Request, res: Response) => {
    // Check for valid token
    const payload = await verifyToken(req.body.tokenId);
    if (!payload) {
        sendError(res, 401, 'Unable to verify token');
        return;
    }

    const token = await upsertUser(payload);
    res.send({ token });
});

export default router;
