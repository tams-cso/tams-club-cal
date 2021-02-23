import Cookies from 'universal-cookie';
import config from '../files/config.json';
import { FetchResponse } from './entries';

/**
 * Performs GET request to endpoint
 * @param {string} url API endpoint to GET
 * @param {string} [auth] Authentication email
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function getRequest(url, auth = null) {
    try {
        const res = await fetch(`${config.backend}${url}?key=${config.apiKey}`, { headers: { authorization: auth } });
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

/**
 * Performs POST request to endpoint
 * @param {string} url API endpoint to POST
 * @param {object} body POST body content
 * @param {boolean} [json] Adds a JSON content type header if true
 * @param {string} [auth] Authentication email
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function postRequest(url, body, json = true, auth = null) {
    try {
        if (json) {
            body.email = addEmail();
            body = JSON.stringify(body);
        }
        const options = { method: 'POST', body, authorization: auth };
        if (json) options.headers = { 'Content-Type': 'application/json' };

        const res = await fetch(`${config.backend}${url}?key=${config.apiKey}`, options);
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

function addEmail() {
    const cookies = new Cookies();
    const email = cookies.get('auth_email');
    if (email === undefined) return null;
    return email;
}

export async function getEventList() {
    return getRequest('/events');
}

export async function getEvent(id) {
    return getRequest(`/events/${id}`);
}

export async function postEvent(event, id = '') {
    return postRequest(`/events/${id}`, event);
}

export async function getClubList() {
    return getRequest('/clubs');
}

export async function getClub(id) {
    return getRequest(`/clubs/${id}`);
}

export async function postClub(club, id = '') {
    // Add email to club
    club.email = addEmail();

    var data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('img', club.coverImgBlobs.img);
    data.append('thumb', club.coverImgBlobs.thumb);
    for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
        if (club.execProfilePicBlobs[i] !== undefined) data.append(`exec${i}`, club.execProfilePicBlobs[i]);
    }
    return postRequest(`/clubs/${id}`, data, false);
}

export async function getVolunteeringList() {
    return getRequest('/volunteering');
}

export async function getVolunteering(id) {
    return getRequest(`/volunteering/${id}`);
}

export async function postVolunteering(vol, id = '') {
    return postRequest(`/volunteering/${id}`, vol);
}

export async function postFeedback(feedback) {
    return postRequest('/feedback', { feedback });
}

export async function getIp() {
    return getRequest('/auth/ip');
}

export async function getAuthUrl() {
    return getRequest('/auth');
}

export async function postAuth(code) {
    return postRequest('/auth', { code });
}

export async function postRefreshAuth(email) {
    return postRequest('/auth/refresh', { email });
}

export async function postTrustedAuth(email) {
    return postRequest('/auth/trusted', { email });
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
