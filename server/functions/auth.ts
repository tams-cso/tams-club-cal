import { OAuth2Client, TokenPayload } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/user';
import { newId } from './util';

// Instantiate Google Auth client
const client = new OAuth2Client(process.env.G_CLIENT_ID);

/**
 * Checks for the Cross-Site Request Forgery (CSRF) token.
 * See https://developers.google.com/identity/gsi/web/guides/verify-google-id-token.
 *
 * @param cookieToken The csrf token found in the cookie header
 * @param bodyToken The csrf token found in the body
 * @returns True if the csrf is valid
 */
function verifyCsrf(cookieToken: string, bodyToken: string): boolean {
    if (cookieToken === undefined || bodyToken === undefined) return false;
    if (cookieToken !== bodyToken) return false;
    return true;
}

/**
 * Verifies Google Auth login token and returns the data.
 * The data we are retrieving is listed in the documentation:
 * https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
 *
 * @param token Credentials from sign in flow
 * @returns User data payload
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
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
 * @param payload User data payload
 * @returns The new auth token
 */
export async function upsertUser(payload: TokenPayload): Promise<string> {
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
    if (res.modifiedCount > 0 || res.upsertedCount > 0) return token;
    else return null;
}

/**
 * Checks to see if a user is an admin, given their login token
 *
 * @param token The string token of the user
 */
export async function isAdmin(token: string): Promise<boolean> {
    const user = await User.findOne({ token }).exec();
    return user.admin;
}

/**
 * Checks to see if there is a user with the given token
 * 
 * @param token Authorization token for the given user
 * @returns True if the user exists
 */
export async function validateHeader(token: string): Promise<boolean> {
    const user = await User.findOne({ token }).exec();
    if (user !== null && user.admin) return true;
    return false;
}
