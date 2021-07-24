const express = require('express');
const router = express.Router();
const { verifyCsrf, verifyToken, upsertUser } = require('../functions/auth');
const { getIp, sendError } = require('../functions/util');
const User = require('../models/user');

/**
 * GET /auth/ip
 *
 * Returns the client's IP address. Will use x-real-ip if avaliable
 * If not, simply just uses req.ip.
 */
router.get('/ip', (req, res, next) => {
    res.send({ ip: getIp(req) });
});

/**
 * GET /auth/user/<token>
 *
 * Sends the user email and name to the client given the token.
 */
router.get('/user/:token', async (req, res, next) => {
    if (!req.params.token) {
        sendError(res, 400, 'Missing token parameter');
        return;
    }
    const user = await User.findOne({ token: req.params.token }).exec();
    if (user) res.send({ email: user.email, name: user.name });
    else sendError(res, 400, 'User not found in database');
});

/**
 * POST /auth
 *
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 */
router.post('/', async (req, res, next) => {
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
router.post('/login', async (req, res, next) => {
    const cookieToken = req.cookies['g_csrf_token'];
    const bodyToken = req.body['g_csrf_token'];
    let error = '';

    // Verify both csrf tokens and actual credentials
    if (verifyCsrf(cookieToken, bodyToken)) {
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
    } else error = 'csrf';

    // Redirect to error if failed verification
    res.redirect(`${process.env.ORIGIN}/auth?error=${error}`);
});

module.exports = router;
