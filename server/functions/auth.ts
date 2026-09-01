import { OAuth2Client, TokenPayload } from 'google-auth-library';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { newId, sendError } from './util';
import { AccessLevelEnum } from '../types/AccessLevel';

// Instantiate Google Auth client
const client = new OAuth2Client(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET);

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
        { googleId: payload.sub },
        {
            $set: {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                token,
            },
            $setOnInsert: { id, level: AccessLevelEnum.STANDARD },
        },
        { upsert: true }
    );
    if (res.modifiedCount > 0 || res.upsertedCount > 0) return token;
    else return null;
}

/**
 * Checks to see if there is a user with the given token. This function
 * will also check for a minimum user level if specified
 *
 * @param token Authorization token for the given user
 * @param level Minimum user level to check for
 * @param id User ID to check, doesn't check if not defined
 * @returns True if the user exists
 */
export async function isValidToken(
    token: string,
    level: AccessLevelEnum = AccessLevelEnum.STANDARD,
    id?: string
): Promise<boolean> {
    const user = await User.findOne({ token }).exec();
    if (user !== null && user.level >= level) {
        if (!id || user.level === AccessLevelEnum.ADMIN) return true;
        return id === user.id;
    }
    return false;
}

/**
 * Interface for decoded Microsoft Entra ID token payload
 */
export interface MicrosoftTokenPayload {
    /** Issuer (https://login.microsoftonline.com/{tenant}/v2.0) */
    iss: string;
    /** Audience (client ID) */
    aud: string;
    /** Object ID of the user in Entra ID */
    oid: string;
    /** User's email address */
    email?: string;
    /** User's display name */
    name?: string;
    /** Tenant ID */
    tid: string;
    /** Subject (usually same as oid) */
    sub: string;
    /** Preferred username (UPN) */
    preferred_username?: string;
    /** Nonce that was included in the authorization request */
    nonce?: string;
    [key: string]: any;
}

/**
 * Result of a Microsoft token verification.
 * Either contains the decoded payload on success or an error message on failure so the error can be surfaced to the client.
 */
export type MicrosoftTokenResult =
    | { success: true; payload: MicrosoftTokenPayload }
    | { success: false; error: string };

/**
 * Verifies a Microsoft Entra ID token.
 * Checks signature, audience, issuer pattern, email domain, and nonce.
 * Uses Microsoft's common JWKS endpoint so it works with any tenant.
 *
 * @param token Microsoft Entra ID token to verify
 * @param nonce The nonce that was stored when the auth request was generated
 * @returns A result object with the decoded payload or an error message
 */
export async function verifyMicrosoftToken(token: string, nonce?: string): Promise<MicrosoftTokenResult> {
    try {
        const msClientId = process.env.MS_CLIENT_ID;

        if (!msClientId) {
            return { success: false, error: 'Microsoft auth is not configured on the server.' };
        }

        // Decode header to get the kid
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || typeof decoded === 'string' || !decoded.header) {
            return { success: false, error: 'Failed to decode Microsoft token.' };
        }

        const kid = decoded.header.kid;
        if (!kid) {
            return { success: false, error: 'Microsoft token is missing the key ID in its header.' };
        }

        // Fetch Microsoft's common JWKS (contains keys for all tenants)
        const jwksUri = 'https://login.microsoftonline.com/common/discovery/v2.0/keys';
        const jwksRes = await fetch(jwksUri);
        if (!jwksRes.ok) {
            return { success: false, error: 'Unable to fetch Microsoft signing keys.' };
        }
        const jwks = (await jwksRes.json()) as { keys: any[] };

        // Find the key matching the kid
        const key = jwks.keys.find((k: any) => k.kid === kid);
        if (!key) {
            return { success: false, error: 'No matching signing key found for the Microsoft token.' };
        }

        // Convert JWK to PEM public key using Node.js crypto
        const pubKey = crypto.createPublicKey({ key, format: 'jwk' });

        // Verify signature, audience, and nonce; accept any valid Microsoft issuer
        const verifyOptions: jwt.VerifyOptions = {
            algorithms: ['RS256'],
            audience: msClientId,
        };
        if (nonce) verifyOptions.nonce = nonce;
        const payload = jwt.verify(token, pubKey, verifyOptions) as MicrosoftTokenPayload;

        // Verify issuer matches the expected Microsoft pattern (any tenant)
        if (
            !payload.iss ||
            !payload.iss.startsWith('https://login.microsoftonline.com/') ||
            !payload.iss.endsWith('/v2.0')
        ) {
            return { success: false, error: 'Microsoft token was issued by an unexpected issuer.' };
        }

        // Check email domain
        const email = payload.email || payload.preferred_username;
        if (!email) {
            return { success: false, error: 'Microsoft token is missing an email address.' };
        }

        const allowedDomains = ['unt.edu', 'my.unt.edu'];
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            return { success: false, error: `Microsoft account email domain not allowed: ${emailDomain}.` };
        }

        return { success: true, payload };
    } catch (error) {
        console.error('Microsoft token verification failed:', error);
        return { success: false, error: 'Microsoft token verification failed.' };
    }
}

/**
 * Generates the Microsoft Entra ID authorize URL for the given user.
 * @param userToken The auth token of the current user
 * @param redirectUri The callback URL that Microsoft should redirect to
 * @returns The full authorize URL, or null if MS_CLIENT_ID is not configured
 */
export async function generateMicrosoftAuthUrl(userToken: string, redirectUri: string): Promise<string> {
    const msClientId = process.env.MS_CLIENT_ID;
    if (!msClientId) {
        throw new Error('Microsoft auth is not configured on the server.');
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    const state = crypto.randomBytes(16).toString('hex');

    await User.updateOne({ token: userToken }, { $set: { msNonce: nonce, msState: state } }).exec();

    const params = new URLSearchParams({
        client_id: msClientId,
        response_type: 'id_token',
        redirect_uri: redirectUri,
        scope: 'openid profile email',
        response_mode: 'fragment',
        nonce,
        state,
    });
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
}

/**
 * Links a Microsoft account to an existing user.
 * Updates the user's msId, msEmail, and msName fields.
 *
 * @param msPayload Decoded Microsoft token payload
 * @param userToken The user's auth token to find the user
 * @returns A result object indicating success or an error message
 */
export async function linkMicrosoftAccount(
    msPayload: MicrosoftTokenPayload,
    userToken: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const msId = msPayload.oid || msPayload.sub;
        const msEmail = msPayload.email || msPayload.preferred_username;
        const msName = msPayload.name || msEmail;

        // Check that the Microsoft account isn't already linked to another user
        const existing = await User.findOne({ msId, token: { $ne: userToken } }).exec();
        if (existing) {
            return { success: false, error: 'This UNT account is already linked to another user.' };
        }

        // Update the user with Microsoft account info
        const res = await User.updateOne({ token: userToken }, { $set: { msId, msEmail, msName } }).exec();

        if (res.modifiedCount > 0) return { success: true };
        return { success: false, error: 'Failed to link UNT account.' };
    } catch (error) {
        console.error('Failed to link Microsoft account:', error);
        return { success: false, error: 'Failed to link UNT account.' };
    }
}

/**
 *
 * @param req Express request object
 * @param res Express response object
 * @param level Level to check for; STANDARD if not defined
 * @param id User ID to check, doesn't check if not defined
 */
export async function isAuthenticated(
    req: Request,
    res: Response,
    level: AccessLevelEnum = AccessLevelEnum.STANDARD,
    id?: string
): Promise<boolean> {
    // Check to see if header is there
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        sendError(res, 401, 'Missing authorization token');
        return false;
    }

    // Make sure the token is valid
    const validHeader = await isValidToken(req.headers.authorization.substring(7), level, id);
    if (!validHeader) {
        sendError(res, 401, 'Invalid authorization token');
        return false;
    }

    // Return true if authenticated
    return true;
}

/**
 * Given a valid token from the Authorization header,
 * returns the user's ID. If the user is invalid, returns null
 * 
 * @param req Express request object
 * @returns The ID of the user or null if invalid request header
 */
export async function getUserId(req: Request): Promise<string> {
    const user = await User.findOne({ token: req.headers.authorization.substring(7) });
    if (!user) return null;
    return user.id;
}
