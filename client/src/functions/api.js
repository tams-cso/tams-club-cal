import config from '../files/config.json';
import { FetchResponse } from './entries';

/**
 * Performs GET request to endpoint
 * @param {string} url API endpoint to GET
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function getRequest(url) {
    try {
        const res = await fetch(`${config.backend}${url}?key=${config.apiKey}`);
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
 * @returns {Promise<FetchResponse>} Will return the object or error object
 */
async function postRequest(url, body, json = true) {
    try {
        const options = { method: 'POST', body };
        if (json) options.headers = { 'Content-Type': 'application/json' };

        const res = await fetch(`${config.backend}${url}?key=${config.apiKey}`, options);
        const data = await res.json();
        return new FetchResponse(res.status, data);
    } catch (error) {
        console.dir(error);
        return new FetchResponse(404, null);
    }
}

export async function getEventList() {
    return getRequest('/events');
}

export async function getEvent(id) {
    return getRequest(`/events/${id}`);
}

export async function postEvent(event, id = '') {
    return postRequest(`/events/${id}`, JSON.stringify(event));
}

export async function getClubList() {
    return getRequest('/clubs');
}

export async function getClub(id) {
    return getRequest(`/clubs/${id}`);
}

export async function postClub(club, id = '') {
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
    return postRequest(`/volunteering/${id}`, JSON.stringify(vol));
}

export async function postFeedback(feedback) {
    return postRequest('/feedback', JSON.stringify(feedback));
}

export async function deleteClub(id) {
    return postRequest('/delete-club', JSON.stringify({ id }));
}
