import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Plugins for dayjs base library
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);

// ================== DATE AND TIME FUNCTIONS =================== //
/**
 * Returns the current time in UTC milliseconds
 */

export function getNow(): number {
    return dayjs().valueOf();
}
/**
 * Returns the dayjs object, corrected to central timezone
 *
 * @param millis UTC millisecond time
 * @returns The dayjs object in the correct timezone
 */

export function toTz(millis: number): Dayjs {
    return dayjs(Number(millis)).tz('America/Chicago');
}
/**
 * Formats a UTC millisecond time while converting to central timezone
 *
 * @param millis UTC millisecond time to format
 * @param format Dayjs format to format the time to
 * @param checkMidnight If true, will check for midnight/noon and return those words if true
 * @returns The formatted time or midnight/noon if checkMidnight is true
 */

export function formatTime(millis: number, format: string, checkMidnight: boolean = false): string {
    if (checkMidnight) {
        const formattedTime = toTz(millis).format('H:m');
        if (formattedTime === '0:0') return 'Midnight';
        else if (formattedTime === '12:0') return 'Noon';
    }
    return toTz(millis).format(format);
}
/**
 * Formats a UTC millisecond date while converting to central timezone
 *
 * @param millis UTC millisecond time to format
 * @param format Dayjs format to format the time to
 */

export function formatDate(millis: number, format: string): string {
    return toTz(millis).format(format);
}
/**
 * Checks if the date is the same between two UTC millisecond times, in the current time zone.
 *
 * @param first The first UTC millisecond time
 * @param second The second UTC millisecond time
 * @returns True if the two times fall on the same date (between 00:00:00.000 and 23:59:59.999)
 */

export function isSameDate(first: number, second: number): boolean {
    return formatTime(first, 'MM/DD/YYYY') === formatTime(second, 'MM/DD/YYYY');
}

// TODO: The formatEventDate and formatEventTime functions are JANK -- need to refactor

/**
 * Formats the full date of the event.
 * Includes an end date if not the same as the start date.
 *
 * @param event The event object
 * @returns The formatted full date
 */

export function formatEventDate(event: CalEvent): string {
    if (!toTz(event.start).isSame(toTz(event.end), 'day')) return 'Start: ' + formatTime(event.start, 'dddd, MMMM D, YYYY h:mma');
    return formatTime(event.start, 'dddd, MMMM D, YYYY');
}
/**
 * Formats the time of the event.
 * Includes an end time if not the same as the start time.
 *
 * @param event The event object
 * @param noEnd If true, will not show an end time
 * @param checkSame If true, will check to see if start !== end and return the end time. This is used for the EventDisplay component
 * @returns The formatted time for the event in the format [h:mma - h:mma]
 */

export function formatEventTime(event: CalEvent, noEnd: boolean = false, checkSame: boolean = false): string {
    if (checkSame && !toTz(event.start).isSame(toTz(event.end), 'day'))
        return 'End: ' + formatTime(event.end, 'dddd, MMMM D, YYYY h:mma');

    let formattedTime = formatTime(event.start, 'h:mma', true);
    if (!noEnd && event.start !== event.end) formattedTime += ` - ${formatTime(event.end, 'h:mma', true)}`;
    return formattedTime;
}

export function formatEventDateTime(event: CalEvent): string {
    return formatTime(event.start, 'dddd, MMMM D, YYYY h:mma') + ' - ' + formatTime(event.end, 'dddd, MMMM D, YYYY h:mma');
}

/**
 * Calculates how long ago an edit was made, given the edit date,
 * and displays it in the most reasonable time interval
 *
 * @param editDate Milliseconds representing the edit date (UTC)
 * @returns Edit date display string
 */

export function calculateEditDate(editDate: number): string {
    var edit = dayjs(editDate);
    var now = dayjs();
    var diff = 0;
    var unit = '';

    const diffs = ['year', 'month', 'day', 'hour', 'minute'] as const;
    for (var i = 0; i < diffs.length; i++) {
        diff = now.diff(edit, diffs[i]);
        unit = diffs[i];
        if (diff > 0) break;
    }

    return `${diff} ${unit}${diff !== 1 ? 's' : ''} ago`;
}
/**
 * Checks if time is not midnight
 * @return 1 if not midnight
 */
export function isNotMidnight(time: number): 0 | 1 {
    // TODO: why are we returning a number and not a boolean????????????????????
    return dayjs(time).hour() === 0 && dayjs(time).minute() === 0 ? 0 : 1;
}
/**
 * Parses the parameters in the url, with the format being /YYYY/M/D. If one more more
 * is missing, will return the 1st of each value in its place. If there are no values, then
 * it will return today's date.
 *
 * @param dates Date list from the parameters
 * @returns Dayjs object containing the date specified in the url
 */

export function parseDateParams(dates: string[]): Dayjs {
    // Return current date if undefined
    if (!dates || dates.length === 0) return dayjs();

    // Get all of the values first
    const rawYear = Number.parseInt(dates[0]);
    let rawMonth = Number.parseInt(dates[1]);
    let rawDate = Number.parseInt(dates[2]);

    // Normalize and replace all values with 1 if illegal
    if (isNaN(rawYear)) return dayjs();
    const year = Math.max(1000, Math.min(9999, rawYear));
    const month = isNaN(rawMonth) ? 0 : rawMonth - 1;
    const date = isNaN(rawDate) ? 1 : rawDate;

    // Return the dayjs object
    return dayjs().year(year).month(month).date(date);
}
