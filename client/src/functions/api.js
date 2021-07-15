import { Event, FetchResponse } from './entries';
import Cookies from 'universal-cookie';

const BACKEND_URL = process.env.NODE_ENV !== 'production' ? '' : 'https://api.tams.club';

/**
 * Performs GET request to endpoint
 * 
 * @param {string} url API endpoint to GET
 * @param {boolean} [auth] True if adding token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function getRequest(url, auth = false) {
    try {
        const res = await fetch(`${BACKEND_URL}${url}`, { headers: createHeaders(auth, false) });
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

/**
 * Performs POST request to endpoint
 * 
 * @param {string} url API endpoint to POST
 * @param {object} body POST body content
 * @param {boolean} [json] Adds a JSON content type header if true
 * @param {boolean} [auth] True if adding token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function postRequest(url, body, json = true, auth = false) {
    try {
        const options = { method: 'POST', body, headers: createHeaders(auth, json) };

        const res = await fetch(`${BACKEND_URL}${url}`, options);
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

/**
 * Creates the header object for fetch requests
 * 
 * @param {boolean} auth True if adding authorization string
 * @param {boolean} json True if adding json content type
 * @returns {Headers} Header object
 */
function createHeaders(auth, json) {
    const cookies = new Cookies();
    const token = cookies.get('token');

    let headers = new Headers();
    if (auth && token) headers.set('Authorization', `Bearer ${token}`);
    if (json) headers.set('Content-Type', 'application/json');
    return headers;
}

/* ########## EVENTS API ########### */

/**
 * Gets the list of events.
 * Default options will return ~20 events including the current day.
 *
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getEventList() {
    return getRequest('/events');
}

/**
 * Gets a specific event by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getEvent(id) {
    return getRequest(`/events/${id}`);
}

/**
 * Create a new event
 *
 * @param {Event} event Event object
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function postEvent(event) {
    return postRequest(`/events`, event);
}

/* ########## CLUBS API ########### */

/**
 * Gets the list of all clubs.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getClubList() {
    return getRequest('/clubs');
}

/**
 * Gets a specific club by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getClub(id) {
    return getRequest(`/clubs/${id}`);
}

export async function postClub(club, id = '') {
    // Add email to club
    club.email = '';

    var data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('img', club.coverImgBlobs.img);
    data.append('thumb', club.coverImgBlobs.thumb);
    for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
        if (club.execProfilePicBlobs[i] !== undefined) data.append(`exec${i}`, club.execProfilePicBlobs[i]);
    }
    return postRequest(`/clubs/${id}`, data, false);
}

/* ########## VOLUNTEERING API ########### */

export async function getVolunteeringList() {
    return getRequest('/volunteering');
}

export async function getVolunteering(id) {
    return getRequest(`/volunteering/${id}`);
}

export async function postVolunteering(vol, id = '') {
    return postRequest(`/volunteering/${id}`, vol);
}

/* ########## MISC API ########### */

/**
 * Submits a new feedback object.
 *
 * @param {object} feedbackObject Feedback object
 * @param {string} feedbackObject.feedback The feedback from the text area
 * @param {string} [feedbackObject.name] The name of the user who submitted the feedback
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function postFeedback(feedbackObject) {
    return postRequest('/feedback', feedbackObject);
}

/**
 * Fetches the current client's IP address.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getIp() {
    return getRequest('/auth/ip');
}

/**
 * Checks if a user's token is in the database
 * @param {string} token User auth token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getLoggedIn(token) {
    return postRequest('/auth', { token });
}

/**
 * Gets the name and email of the logged in user
 * @param {string} token User auth token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getUserInfo(token) {
    // TODO: convert this token path to an Authorization Bearer header instead
    return getRequest(`/auth/user/${token}`);
}

export async function postTrustedAuth(email) {
    return postRequest('/auth/trusted', { email });
}

export async function getHistoryAll() {
    return getRequest(`/history`);
}

export async function getHistoryList(resource, id) {
    return getRequest(`/history/${resource}/${id}`);
}

export async function getHistoryData(resource, id, index) {
    return getRequest(`/history/${resource}/${id}/${index}`);
}

export async function getDb(db, collection, email) {
    return getRequest(`/admin/db/${db}/${collection}`, email);
}

export async function postDb(db, collection, data, email) {
    return postRequest(`/admin/db/${db}/${collection}`, data, true, email);
}

export async function deleteClub(id) {
    return postRequest('/delete-club', id);
}
