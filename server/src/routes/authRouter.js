const express = require('express');
const router = express.Router();
const { verifyCsrf, verifyToken, upsertUser } = require('../functions/auth');

/**
 * /auth
 * 
 * Given a token in the body request, determine if that user is logged in.
 * If invalid token or missing token, return false.
 */
router.post('/', async (req, res, next) => {
    res.send({ loggedIn: true });
});

/**
 * /auth/login
 * 
 * Recieve the Oauth2 sign in credentials and do a token exchange
 * to either return an auth code or an error
 */
router.post('/login', async (req, res, next) => {
    const cookieToken = req.cookies['g_csrf_token'];
    const bodyToken = req.body['g_csrf_token'];

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
            }
        }
    }

    // Redirect to error if failed verification
    res.redirect(`${process.env.ORIGIN}/auth`);
});

module.exports = router;
