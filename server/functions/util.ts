import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import statusList from '../files/status.json';
import envList from '../files/env.json';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Timezone events are entered and repeated in. Stored times are UTC millis.
 */
export const CENTRAL_TZ = 'America/Chicago';

/**
 * Wall clock format with no offset, for moving times between zones.
 */
const WALL_CLOCK = 'YYYY-MM-DDTHH:mm:ss';

/**
 * Checks that all the neccessary environmental variables
 * are defined before running the app.
 * The function will throw an error and exit the app if
 * a variable is missing.
 */
export function checkEnv() {
    envList.forEach((e) => {
        if (process.env[e] === undefined) {
            console.error(`ERROR: The ${e} environmental variable was not defined.`);
            process.exit(1);
        }
    });
}

/**
 * Sends an error with the provided status
 * (see: https://httpstatuses.com/) and error message.
 * The status codes are in ../files/status.json
 */
export function sendError(res: Response, status = 500, message = 'Internal Server Error') {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status} ${statusList[status]}`,
        error: message,
    });
}

/**
 * Creates and returns a new UUIDv4
 */
export function newId(): string {
    return uuidv4();
}

/**
 * Extracts the IP address from the header of the express request object
 */
export function getIp(req: Request): string {
    return (req.headers['x-real-ip'] as string) || req.ip;
}

/**
 * Start times of the rest of a weekly series. First instance isn't included.
 *
 * Adding a week to a dayjs in the server's local zone only keeps the wall clock
 * if that zone has the same DST rules as CENTRAL_TZ. UTC has none, so every
 * instance after a transition lands an hour off. Walk the wall clock in
 * CENTRAL_TZ instead, which also matches what the client checks.
 *
 * @param start First instance, UTC millis
 * @param repeatsUntil Last day of the series, inclusive, UTC millis
 * @param weeksBetween Weeks between instances
 * @returns Start of each later instance, UTC millis
 */
export function getWeeklyStarts(start: number, repeatsUntil: number, weeksBetween: number = 1): number[] {
    const starts = [];
    // Strip the offset so adding a week is just calendar math
    const toWallClock = (millis: number) => dayjs(millis).tz(CENTRAL_TZ).format(WALL_CLOCK);
    let wallClock = dayjs(toWallClock(start)).add(weeksBetween, 'week');
    const lastDay = dayjs(toWallClock(repeatsUntil)).add(1, 'day');

    // repeatsUntil is inclusive, so stop after that day
    while (wallClock.isBefore(lastDay, 'day')) {
        starts.push(dayjs.tz(wallClock.format(WALL_CLOCK), CENTRAL_TZ).valueOf());
        wallClock = wallClock.add(weeksBetween, 'week');
    }
    return starts;
}
