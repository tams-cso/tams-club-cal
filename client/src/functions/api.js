import config from '../files/config.json';
import { Club, ClubInfo, ClubData, Event, EventInfo, EventData, Volunteering } from './entries';

/**
 * GET to /event?id=${id} - Gets event with given id
 * @returns {Promise<EventData>} An array of all events' basic information
 */
async function getEvent(id) {
    return await fetch(`${config.backend}/event?id=${id}`).then((res) => res.json());
}

/**
 * GET to /event-list - Gets the list of all events
 * @returns {Promise<EventInfo[]>} An array of all events' basic information
 */
async function getEventList() {
    // TODO: Add a start and end time range
    return await fetch(`${config.backend}/event-list`).then((res) => res.json());
}

/**
 * POST to /add - Creates an event
 * @param {Event} event Event object
 * @returns {Promise<number>} POST status [200 for Success & 400 for Failure]
 */
async function postEvent(event) {
    const res = await fetch(`${config.backend}/add-event`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
    });
    return res.status;
}

/**
 * GET to /club?id=${id} - Gets club with given id
 * @returns {Promise<ClubData>} Object of club specified by id
 */
async function getClub(id) {
    return await fetch(`${config.backend}/club?id=${id}`).then((res) => res.json());
}

/**
 * GET to /club-list - Gets the list of clubs
 * @returns {Promise<ClubInfo[]>} An array of all clubs' basic information
 */
async function getClubList() {
    return await fetch(`${config.backend}/club-list`).then((res) => res.json());
}

/**
 * GET to /volunteering - Gets the list of volunteering opportunities
 * @returns {Promise<Volunteering[]>} An array of all volunteering opportunities
 */
async function getVolunteering() {
    return await fetch(`${config.backend}/volunteering`).then((res) => res.json());
}

/**
 * POST to /feedback - Uploads user feedback
 * @param {string} feedback The feedback
 * @returns {Promise<number>} POST status [200 for Success & 400 for Failure]
 */
async function postFeedback(feedback) {
    console.log(feedback);
    const res = await fetch(`${config.backend}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
        headers: { 'Content-Type': 'application/json' },
    });
    return res.status;
}

export { getClub, getClubList, postFeedback, postEvent, getEvent, getEventList, getVolunteering };
