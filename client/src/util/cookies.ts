import dayjs from 'dayjs';
import Cookies from 'universal-cookie';

// Cookie object
const cookies = new Cookies();

/**
 * Sets a cookie as a <key, value> string pair
 * All values will be cast to a string by universal-cookie!
 *
 * @param name Key for the cookie
 * @param value Value for the cookie
 */
export function setCookie(name: string, value: any): void {
    cookies.set(name, value, { sameSite: 'strict', path: '/', expires: dayjs('2099-01-01T00:00:00.000Z').toDate() });
}

/**
 * Gets a cookie; returns the value or null
 *
 * @param name Key for the cookie
 * @return Value of the cookie or null if not found
 */
export function getCookie(name: string): string {
    const val = cookies.get(name, {doNotParse: true});
    if (val) return val;
    else return null;
}

/**
 * Removes a cookie given its key
 * 
 * @param name Key for the cookie
 */
export function removeCookie(name: string) {
    cookies.remove(name, { path: '/' });
}

/**
 * Gets the user auth token from the token cookie.
 * 
 * The token may be stored as a plain string or as a JSON object
 * string in the form {"token": "<token>"} (from older logins),
 * so both formats are handled here.
 *
 * @return The auth token or null if not found
 */
export function getTokenFromCookie(): string | null {
    const val = getCookie('token');
    if (!val) return null;
    try {
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null && parsed.token) return parsed.token;
        if (typeof parsed === 'string') return parsed;
    } catch (e) {
        // if the value is not valid json, continue and treat it as a plain token
    }
    return val;
}