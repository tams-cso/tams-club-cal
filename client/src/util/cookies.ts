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
    const val = cookies.get(name);
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