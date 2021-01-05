import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { EventInfo } from './entries';

dayjs.extend(utc);
dayjs.extend(timezone);

function getId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * Parses a time using dayjs and returns the seconds in milliseconds.
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} input String time input for dayjs to parse
 * @param {string} tz Tz database time zone (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * @returns {number} Milliseconds since Jan 1, 1970 [UTC time]
 */
function parseTimeZone(input, tz) {
    return dayjs.tz(input, tz).valueOf();
}

/**
 * Offsets a millisecond UTC to a dayjs object in the correct timezone
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} millis UTC millisecond time
 * @param {string} [tz] Tz database time zone; If left blank, the timezone will be guessed
 * @returns {dayjs.Dayjs} Dayjs object with the correct timezone
 */
function convertToTimeZone(millis, tz) {
    if (tz == undefined) {
        var tz = dayjs.tz.guess();
    }
    return dayjs(Number(millis)).tz(tz);
}

/**
 * Takes a list of sorted events and injects date seperators
 *
 * @param {EventInfo[]} eventList List of events, with an extra dayjs object defined
 */
function divideByDate(eventList) {
    var currDay = '';
    for (var i = 0; i < eventList.length; i++) {
        var day = eventList[i].startDayjs.format('YYYY-MM-DD');
        if (currDay != day) {
            currDay = day;
            eventList.splice(i, 0, {
                isDate: true,
                day,
            });
            i++;
        }
    }
}

/**
 * Converts a date to a readable date section label
 *
 * @param {string} date Date passed in formatted as YYYY-MM-DD
 * @return {string} Readable date section label
 */
function createDateHeader(date) {
    return dayjs(date).format('dddd M/D/YY');
}

/**
 * Gets the starting and ending time display for an event
 *
 * @param {EventInfo} event The event object
 * @return {string} The formatted starting and ending time
 */
function getFormattedTime(event) {
    if (event.type === 'event') return event.startDayjs.format('h:mma - ') + event.endDayjs.format('h:mma');
    return event.startDayjs.format('h:mma');
}

export { getId, parseTimeZone, convertToTimeZone, divideByDate, createDateHeader, getFormattedTime };
