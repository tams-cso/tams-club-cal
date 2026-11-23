import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
 * Start times of the rest of a weekly series. First instance isn't included.
 *
 * Adding a week to a dayjs keeps its old UTC offset, so instances after a DST
 * transition land an hour off. Walk the wall clock in CENTRAL_TZ and resolve
 * it there instead, so the client and server agree wherever this code runs.
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
