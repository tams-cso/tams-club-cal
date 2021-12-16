const { OAuth2Client, TokenPayload } = require('google-auth-library');
const crypto = require('crypto');
const uuid = require('uuid');
const User = require('../models/user');
const { newId } = require('./util');

const client = new OAuth2Client(process.env.G_CLIENT_ID);

/**
 * Checks for the Cross-Site Request Forgery (CSRF) token.
 * See https://developers.google.com/identity/gsi/web/guides/verify-google-id-token.
 *
 * @param {string} cookieToken The csrf token found in the cookie header
 * @param {string} bodyToken The csrf token found in the body
 * @returns {boolean} True if the csrf is valid
 */
function verifyCsrf(cookieToken, bodyToken) {
    if (cookieToken === undefined || bodyToken === undefined) return false;
    if (cookieToken !== bodyToken) return false;
    return true;
}

/**
 * Verifies Google Auth login token and returns the data.
 * The data we are retrieving is listed in the documentation:
 * https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
 *
 * @param {string} token Credentials from sign in flow
 * @returns {Promise<TokenPayload>} User data payload
 */
async function verifyToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.G_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Upserts a user into the users collection.
 * This will generate a new auth token regardless of the status.
 * The auth token is used to authenticate frontend users when submitting edits.
 * The data to be extracted from the payload is: { id: sub, email, name }
 *
 * @param {TokenPayload} payload User data payload
 * @returns {Promise<string>} The new auth token
 */
async function upsertUser(payload) {
    const token = crypto.randomBytes(32).toString('hex');
    const id = newId();
    const res = await User.updateOne(
        { sub: payload.sub },
        {
            $set: {
                sub: payload.sub,
                email: payload.email,
                name: payload.name,
                token,
            },
            $setOnInsert: { id, admin: false },
        },
        { upsert: true }
    );
    if (res.ok > 0) return token;
    else return null;
}

/**
 * Checks to see if a user is an admin, given their login token
 *
 * @param {string} token The string token of the user
 * @returns {Promise<boolean>} True if the user is an admin
 */
async function isAdmin(token) {
    const user = await User.findOne({ token }).exec();
    return user.admin;
}

/**
 * Checks to see if there is a user with the given token
 * @param {string} token Authorization token for the given user
 * @returns {Promise<boolean>} True if the user exists
 */
async function validateHeader(token) {
    const user = await User.findOne({ token }).exec();
    if (user === null) return false;
    return true;
}

module.exports = { verifyCsrf, verifyToken, upsertUser, isAdmin, validateHeader };
