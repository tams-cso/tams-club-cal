import config from '../files/config.json';
import { ClubInfo, Event } from './entries';

/**
 * POST to /add - Creates an event
 * @param {Event} event Event object
 * @returns {number} POST status [200 for Success & 400 for Failure]
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
 * GET to /clubs - Gets the list of clubs
 * @returns {ClubInfo[]} An array of all clubs' basic information
 */
async function getClubList() {
    return await fetch(`${config.backend}/clubs`).then((res) => res.json());
}

/**
 * POST to /feedback - Uploads user feedback
 * @param {string} feedback The feedback
 * @returns {number} POST status [200 for Success & 400 for Failure]
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

export { getClubList, postFeedback, postEvent };
