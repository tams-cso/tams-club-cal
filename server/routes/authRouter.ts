import express from 'express';
import type { Request, Response } from 'express';
import {
    verifyToken,
    upsertUser,
    verifyMicrosoftToken,
    linkMicrosoftAccount,
    isAuthenticated,
    generateMicrosoftAuthUrl,
} from '../functions/auth';
import { getIp, sendError } from '../functions/util';
import User from '../models/user';
import { AccessLevelEnum } from '../types/AccessLevel';
import { asyncHandler } from '../functions/asyncHandler';

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
 * GET /auth/microsoft-auth-url
 *
 * Generates the Microsoft Entra ID authorize URL for the currently
 * authenticated user.
 */
router.get(
    '/microsoft-auth-url',
    asyncHandler(async (req: Request, res: Response) => {
        if (!(await isAuthenticated(req, res, AccessLevelEnum.STANDARD))) return;

        const userToken = req.headers.authorization.substring(7);
        const clientOrigin = process.env.ORIGIN || req.get('origin') || `${req.protocol}://${req.get('host')}`;
        const redirectUri = `${clientOrigin}/auth/unt-callback`;

        try {
            const url = await generateMicrosoftAuthUrl(userToken, redirectUri);
            res.send({ url });
        } catch (error) {
            sendError(res, 500, error.message || 'Unable to start Microsoft login');
        }
    }),
);

/**
 * GET /auth/<token>
 *
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 * This function will also return the user's level if they are logged in.
 */
router.get(
    '/:token',
    asyncHandler(async (req: Request, res: Response) => {
        const user = await User.findOne({ token: req.params.token }).exec();
        if (user) res.send({ loggedIn: true, level: user.level });
        else res.send({ loggedIn: false, level: null });
    }),
);

/**
 * POST /auth/login
 *
 * Recieve the Oauth2 sign in credentials and do a token exchange
 * to either return an auth code or an error
 */
router.post(
    '/login',
    asyncHandler(async (req: Request, res: Response) => {
        // Check for valid token
        const payload = await verifyToken(req.body.credential);
        if (!payload) {
            sendError(res, 401, 'Unable to verify token');
            return;
        }

        const token = await upsertUser(payload);
        res.send({ token });
    }),
);

/**
 * POST /auth/link-microsoft
 *
 * Links a Microsoft Entra ID account to an existing user account.
 * The user must be authenticated (token in Authorization header).
 * The Microsoft ID token must be from an @unt.edu or @my.unt.edu email.
 * This permanently links the two accounts so the user can eventually log in with Microsoft.
 */
router.post(
    '/link-microsoft',
    asyncHandler(async (req: Request, res: Response) => {
        // Check if user is authenticated
        if (!(await isAuthenticated(req, res, AccessLevelEnum.STANDARD))) return;

        // Get the user's auth token from the Authorization header
        const userToken = req.headers.authorization.substring(7);

        // Check if the user already has a Microsoft account linked
        const currentUser = await User.findOne({ token: userToken }).exec();
        if (currentUser?.msId) {
            sendError(res, 400, 'Microsoft account already linked to this user');
            return;
        }

        // Validate the OAuth state against the one stored on the user
        if (!currentUser?.msState || !req.body.state || currentUser.msState !== req.body.state) {
            // Clear the stored state so a stale/mismatched state cannot be reused
            await User.updateOne({ token: userToken }, { $unset: { msNonce: '', msState: '' } }).exec();
            sendError(res, 400, 'Invalid OAuth state; please try linking your UNT account again.');
            return;
        }

        // Clear the stored nonce/state since the auth request has been consumed
        await User.updateOne({ token: userToken }, { $unset: { msNonce: '', msState: '' } }).exec();

        // Verify the Microsoft token, checking the nonce claim against the stored value
        const verification = await verifyMicrosoftToken(req.body.credential, currentUser.msNonce);
        if ('error' in verification) {
            sendError(res, 401, verification.error);
            return;
        }
        const msPayload = verification.payload;

        // Link the Microsoft account
        const linkResult = await linkMicrosoftAccount(msPayload, userToken);
        if (!linkResult.success) {
            sendError(res, 500, linkResult.error || 'Failed to link Microsoft account');
            return;
        }

        res.send({
            msId: msPayload.oid || msPayload.sub,
            msEmail: msPayload.email || msPayload.preferred_username,
            msName: msPayload.name || msPayload.preferred_username,
        });
    }),
);

export default router;
