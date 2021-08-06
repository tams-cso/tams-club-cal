import { Club, ClubImageBlobs, Event, Feedback, FetchResponse, Reservation, Volunteering } from './entries';
import Cookies from 'universal-cookie';

const BACKEND_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND === 'staging'
            ? 'https://dev.tams.club'
            : 'https://api.tams.club'
        : process.env.REACT_APP_BACKEND === 'localhost'
        ? 'http://localhost:5000'
        : '';

const CDN_URL =
    process.env.REACT_APP_BACKEND === 'staging' || process.env.REACT_APP_BACKEND === 'localhost'
        ? 'https://staging.cdn.tams.club'
        : 'https://cdn.tams.club';

/**
 * Performs a GET request to the given endpoint.
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
 * Performs a POST request to the given endpoint.
 *
 * @param {string} url API endpoint to POST
 * @param {object} body POST body content
 * @param {boolean} [json] Adds a JSON content type header if true
 * @param {boolean} [auth] True if adding token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function postRequest(url, body, json = true, auth = true) {
    try {
        const options = {
            method: 'POST',
            body: json ? JSON.stringify(body) : body,
            headers: createHeaders(auth, json),
        };

        const res = await fetch(`${BACKEND_URL}${url}`, options);
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

/**
 * Performs a POST request to the given endpoint.
 *
 * @param {string} url API endpoint to POST
 * @param {object} body POST body content
 * @param {boolean} [json] Adds a JSON content type header if true
 * @param {boolean} [auth] True if adding token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function putRequest(url, body, json = true, auth = true) {
    try {
        const options = { method: 'PUT', body: json ? JSON.stringify(body) : body, headers: createHeaders(auth, json) };

        const res = await fetch(`${BACKEND_URL}${url}`, options);
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

/**
 * Creates the header object for fetch requests.
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

/* ########## EVENTS/RESERVATIONS API ########### */

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
 * Gets the list of events.
 * Default options will return ~20 events including the current day.
 *
 * @param {string} id The ID of the last event gotten
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getMoreEvents(id) {
    return getRequest(`/events?lastEvent=${id}`);
}

/**
 * Returns a list of events between two dates
 *
 * @param {number} start Starting time to get events from
 * @param {number} end Ending time to get events to
 * @returns
 */
export async function getEventListInRange(start, end) {
    return getRequest(`/events?start=${start}&end=${end}`);
}

/**
 * Gets a specific event by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getEvent(id) {
    return getRequest(`/events/${id}`);
}

/**
 * Creates a new event
 *
 * @param {Event} event Event object
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function postEvent(event) {
    return postRequest('/events', event);
}

/**
 * Updates an event
 *
 * @param {Event} event Event object
 * @param {string} id ID of the event to update
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function putEvent(event, id) {
    return putRequest(`/events/${id}`, event);
}

/**
 * Gets the list of all reservations in a week
 * If week is not defined, will get the current week's reservations by default
 *
 * @param {number} [week] UTC time for the current week to get; this can be any time within the week
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getReservationList(week = null) {
    return getRequest(`/reservations${week ? `?week=${week}` : ''}`);
}

/**
 * Gets a specific reservation by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getReservation(id) {
    return getRequest(`/reservations/${id}`);
}

/**
 * Gets the list of all repeating reservations for a week
 * If week is not defined, will get all reservations that repeat up to and after the current week
 *
 * @param {number} [week] UTC time for the current week to get; this can be any time within the week
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getRepeatingReservationList(week = null) {
    return getRequest(`/reservations/repeating${week ? `?week=${week}` : ''}`);
}

/**
 * Gets a specific repeating reservation by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getRepeatingReservation(id) {
    return getRequest(`/reservations/repeating/${id}`);
}

/**
 * Creates a new reservation
 *
 * @param {Reservation} reservation Reservation object
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function postReservation(reservation) {
    return postRequest('/reservations', reservation);
}

/**
 * Updates an reservation
 *
 * @param {Reservation} reservation Reservation object
 * @param {string} id ID of the event to update
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function putReservation(reservation, id) {
    return putRequest(`/reservations/${id}`, reservation);
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

/**
 * Creates a new club.
 *
 * @param {Club} club Club object
 * @param {ClubImageBlobs} images Club image blobs object
 * @param {boolean[]} execPhotos True for the execs that have new images; should be same length as club.execs
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function postClub(club, images) {
    const data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('cover', images.coverPhoto);
    data.append('execPhotos', JSON.stringify(execPhotos));
    images.profilePictures.forEach((p) => {
        data.append('exec', p);
    });
    return postRequest('/clubs', data, false);
}

/**
 * Updates a club
 *
 * @param {Club} club Club object
 * @param {ClubImageBlobs} images Club image blobs object
 * @param {boolean[]} execPhotos True for the execs that have new images; should be same length as club.execs
 * @param {string} id ID of the club to update
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function putClub(club, images, execPhotos, id) {
    const data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('cover', images.coverPhoto);
    data.append('execPhotos', JSON.stringify(execPhotos));
    images.profilePictures.forEach((p) => {
        data.append('exec', p);
    });
    return putRequest(`/clubs/${id}`, data, false);
}

/* ########## VOLUNTEERING API ########### */

/**
 * Gets the list of all volunteering opportunities.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getVolunteeringList() {
    return getRequest('/volunteering');
}

/**
 * Gets a specific volunteering opportunity by ID.
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getVolunteering(id) {
    return getRequest(`/volunteering/${id}`);
}

/**
 * Creates a new volunteering opportunity
 *
 * @param {Volunteering} volunteering Volunteering object
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function postVolunteering(volunteering) {
    return postRequest(`/volunteering`, volunteering);
}

/**
 * Updates a volunteering opportunity
 *
 * @param {Volunteering} volunteering Volunteering object
 * @param {string} id ID of the volunteering opportunity to update
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function putVolunteering(volunteering, id) {
    return putRequest(`/volunteering/${id}`, volunteering);
}

/* ########## HISTORY API ########## */

/**
 * Gets the list of history objects starting from the start ID.
 * If no ID is defined, this will return the last 50 edits.
 *
 * @param {string} start The ID of the oldest edit to start retrieving from
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getHistoryList(start) {
    return getRequest(`/history${start ? `?start=${start}` : ''}`);
}

/**
 * Gets the list of edit histories for a specific resource with the given ID.
 * @param {"events" | "clubs" | "volunteering" | "reservations"} resource The resource to get
 * @param {string} id The ID to get the history of
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getHistory(resource, id) {
    return getRequest(`/history/${resource}/${id}`);
}

/* ########## MISC API ########### */

/**
 * Submits a new feedback object.
 *
 * @param {Feedback} feedback Feedback object
 * @returns {Promise<FetchResponse>} Will return the response or error object
 */
export async function postFeedback(feedback) {
    return postRequest('/feedback', feedback, true, false);
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
    return postRequest('/auth', { token }, true, false);
}

/**
 * Gets the name and email of the logged in user
 * @param {string} token User auth token
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getUserInfo(token) {
    return getRequest(`/auth/user/${token}`);
}

/**
 * Gets the name of the user with the provided ID
 * @param {string} id User ID
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
export async function getUserById(id) {
    return getRequest(`/auth/user/id/${id}`);
}

export function getBackendUrl() {
    return BACKEND_URL;
}

export function getCdnUrl() {
    return CDN_URL;
}
