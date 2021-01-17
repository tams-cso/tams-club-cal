import config from '../files/config.json';
import { Club, ClubInfo, ClubData, Event, EventInfo, EventData, Volunteering } from './entries';

/**
 * GET to /event?id=${id} - Gets event with given id
 * @returns {Promise<EventData>} An array of all events' basic information
 */
async function getEvent(id) {
    try {
        return await fetch(`${config.backend}/event?id=${id}`).then((res) => res.json());
    } catch (error) {
        console.dir(error);
    }
}

/**
 * GET to /event-list - Gets the list of all events
 * @returns {Promise<EventInfo[]>} An array of all events' basic information
 */
async function getEventList() {
    // TODO: Add a start and end time range
    try {
        return await fetch(`${config.backend}/event-list`).then((res) => res.json());
    } catch (error) {
        console.dir(error);
    }
}

/**
 * POST to /add - Creates or updates an event
 * @param {Event} event Event object
 * @param {string} [id] ID to update
 * @returns {Promise<number>} POST status [200 for Success & 400 for Failure]
 */
async function postEvent(event, id = null) {
    var update = id !== undefined && id !== null ? `?update=true&id=${id}` : '';
    try {
        const res = await fetch(`${config.backend}/add-event${update}`, {
            method: 'POST',
            body: JSON.stringify(event),
            headers: { 'Content-Type': 'application/json' },
        });
        return res.status;
    } catch (error) {
        console.dir(error);
    }
}

/**
 * GET to /club?id=${id} - Gets club with given id
 * @returns {Promise<ClubData>} Object of club specified by id
 */
async function getClub(id) {
    try {
        return await fetch(`${config.backend}/club?id=${id}`).then((res) => {
            if (res.status === 400) return null;
            else return res.json();
        });
    } catch (error) {
        console.dir(error);
    }
}

/**
 * GET to /club-list - Gets the list of clubs
 * @returns {Promise<ClubInfo[]>} An array of all clubs' basic information
 */
async function getClubList() {
    try {
        return await fetch(`${config.backend}/club-list`).then((res) => res.json());
    } catch (error) {
        console.dir(error);
    }
}

/**
 * POST to /add-club - Creates or updates a club
 * @param {Club} club Club object
 * @param {string} [id] ID to update
 * @returns {Promise<object | null>} POST response of a string for the updated cover image thumbnail url
 */
async function postClub(club, id = null) {
    var data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('img', club.coverImgBlobs.img);
    data.append('thumb', club.coverImgBlobs.thumb);
    for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
        if (club.execProfilePicBlobs[i] !== undefined) data.append(`exec${i}`, club.execProfilePicBlobs[i]);
    }

    var update = id !== undefined && id !== null ? `?update=true&id=${id}` : '';
    const res = await fetch(`${config.backend}/add-club${update}`, {
        method: 'POST',
        body: data,
    });
    if (res.status !== 200) return { url: null };
    return res.json();
}

/**
 * POST to /add-volunteering - Adds or updates a volunteering event
 * @param {Volunteering} vol The volunteering object
 * @param {string} [id] ID to update
 */
async function postVolunteering(vol, id) {
    var update = id !== undefined && id !== null ? `?update=true&id=${id}` : '';
    try {
        const res = await fetch(`${config.backend}/add-volunteering${update}`, {
            method: 'POST',
            body: JSON.stringify(vol),
            headers: { 'Content-Type': 'application/json' },
        });
        return res.status;
    } catch (error) {
        console.dir(error);
    }
}

/**
 * GET to /volunteering - Gets the list of volunteering opportunities
 * @returns {Promise<Volunteering[]>} An array of all volunteering opportunities
 */
async function getVolunteering() {
    try {
        return await fetch(`${config.backend}/volunteering`).then((res) => res.json());
    } catch (error) {
        console.dir(error);
    }
}

/**
 * POST to /feedback - Uploads user feedback
 * @param {string} feedback The feedback
 * @returns {Promise<number>} POST status [200 for Success & 400 for Failure]
 */
async function postFeedback(feedback) {
    console.log(feedback);
    try {
        const res = await fetch(`${config.backend}/feedback`, {
            method: 'POST',
            body: JSON.stringify({ feedback }),
            headers: { 'Content-Type': 'application/json' },
        });
        return res.status;
    } catch (error) {
        console.dir(error);
    }
}

export {
    getClub,
    getClubList,
    postFeedback,
    postEvent,
    getEvent,
    getEventList,
    getVolunteering,
    postVolunteering,
    postClub,
};
