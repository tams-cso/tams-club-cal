import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Link from '@material-ui/core/Link';

import { EventInfo, Event } from './entries';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);

/**
 * Gets query parameters
 *
 * @param {string} query key value to get from the querystring
 * @returns {string | null} The value of the query parameter or null if missing
 */
export function getParams(query) {
    return new URLSearchParams(window.location.search).get(query);
}

/**
 * Takes in text and a classname, parses the links, and creates
 * a Fragment with the links in Link elements
 *
 * @param {string} text The text to parse and display
 * @returns {object} A React jsx fragment containing text and link components
 */
export function parseLinks(text) {
    const re = /((?:http|https):\/\/.+?)(?:\.|\?|!)?(?:\s|$)/g;
    let m;
    let matches = [];
    do {
        m = re.exec(text);
        if (m) matches.push(m);
    } while (m);

    let tempText = text;
    let outText = [];
    let prevIndex = 0;
    matches.forEach((m) => {
        outText.push(tempText.substring(prevIndex, tempText.indexOf(m[1])));
        outText.push(
            <Link key={m[1]} href={m[1]} alt={m[1]}>
                {m[1]}
            </Link>
        );
        tempText = tempText.substring(tempText.indexOf(m[1]) + m[1].length);
    });
    outText.push(tempText);

    return <React.Fragment>{outText}</React.Fragment>;
}

/**
 * Redirect user and reload the page to a specified path
 * @param {string} path Path to redirect to (starts with /)
 */
export function redirect(path) {
    window.location = `${window.location.origin}${path}`;
}

/**
 * This function will remove all deleted links and return
 * a string list of the values, with the empty ones removed
 * 
 * @param {object[]} list List of link objects with deleted and value attributes
 * @returns {string[]} List of all links
 */
export function processLinkObjectList(list) {
    const filteredList = list.filter((l) => !l.deleted && l.value.trim() !== '');
    return filteredList.map((l) => l.value);
}

// ================== CSS AND MUI FUNCTIONS =================== //

/**
 * Adds an extra 'active' classname to an element's classname if state is true.
 *
 * @param {boolean} state State variable, true would be active
 * @param {string} defualtClassName Base name of the class
 * @param {string} activeClassName Name of the active class
 * @returns {string} Classname string
 */
export function isActive(state, defaultClassName, activeClassName) {
    return `${defaultClassName} ${state ? activeClassName : ''}`;
}

/**
 * Sets a style depending on whether or not the theme is light/dark
 *
 * @param {import('@material-ui/core').Theme} theme The Mui theme object
 * @param {string} light Light theme style
 * @param {string} dark Dark theme style
 * @returns {string} Style string
 */
export function darkSwitch(theme, light, dark) {
    return theme.palette.type === 'light' ? light : dark;
}

/**
 * Sets a grey (400/600) depending on whether or not the theme is light/dark
 *
 * @param {import('@material-ui/core').Theme} theme The Mui theme object
 * @returns {string} Style string
 */
export function darkSwitchGrey(theme) {
    return darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]);
}

// ================== DATE AND TIME FUNCTIONS =================== //

/**
 * Returns the dayjs object, corrected to the current time zone
 *
 * @param {Number} millis UTC millisecond time
 * @returns {dayjs.Dayjs} The dayjs object in the correct time zone
 */
export function toTz(millis) {
    return dayjs(Number(millis)).tz('America/Chicago');
}

/**
 * Formats a UTC millisecond time while converting to America/Chicago timezone
 *
 * @param {Number} millis UTC millisecond time to format
 * @param {string} format Dayjs format to format the time to
 * @returns {string} The formatted time
 */
export function formatTime(millis, format) {
    return toTz(millis).format(format);
}

/**
 * Checks if the date is the same between two UTC millisecond times, in the current time zone.
 *
 * @param {Number} first The first UTC millisecond time
 * @param {Number} second The second UTC millisecond time
 * @returns {boolean} True if the two times fall on the same date (between 00:00:00.000 and 23:59:59.999)
 */
export function isSameDate(first, second) {
    return formatTime(first, 'MM/DD/YYYY') === formatTime(second, 'MM/DD/YYYY');
}

/**
 * Formats the full date of the event.
 * Includes an end date if not the same as the start date.
 *
 * @param {Event} event The event object
 * @returns
 */
export function formatEventDate(event) {
    let formattedTime = formatTime(event.start, 'dddd, MMMM d, YYYY');
    if (!isSameDate(event.start, event.end)) formattedTime += formatTime(event.end, ' - dddd, MMMM d, YYYY');
    return formattedTime;
}

/**
 * Formats the time of the event.
 * Includes an end time if not the same as the start time.
 *
 * @param {Event} event The event object
 * @returns
 */
export function formatEventTime(event) {
    let formattedTime = formatTime(event.start, 'h:mma');
    if (event.start !== event.end) formattedTime += formatTime(event.end, ' - h:mma');
    return formattedTime;
}

/**
 *
 * @param {Dayjs} date Dayjs date object
 */
export function dateToMillis(date) {
    return date.valueOf();
}

// ================== OLD FUNCTIONS =================== //

/**
 * Parses a time using dayjs and returns the seconds in milliseconds.
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} input String time input for dayjs to parse
 * @param {string} tz Tz database time zone (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * @returns {number} Milliseconds since Jan 1, 1970 [UTC time]
 */
export function parseToTimeZone(input, tz) {
    return dayjs.tz(input, 'YYYY-MM-DD HH:mm', tz).valueOf();
}

/**
 * Offsets a millisecond UTC to a dayjs object in the correct timezone
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} millis UTC millisecond time
 * @param {string} [tz] Tz database time zone; If left blank, the timezone will be guessed
 * @returns {dayjs.Dayjs} Dayjs object with the correct timezone
 */
export function convertToTimeZone(millis, tz) {
    if (tz == undefined) {
        var tz = dayjs.tz.guess();
    }
    return dayjs(Number(millis)).tz(tz);
}

/**
 * Gets the starting and ending time display for an event
 *
 * @param {EventInfo} event The event object
 * @returns {string} The formatted starting and ending time
 */
export function getFormattedTime(event, calendar = false) {
    if (calendar) return event.startDayjs.format('h:mma');
    var formattedDate = event.startDayjs.format('h:mma');
    if (event.type === 'event') return formattedDate + event.endDayjs.format(' - h:mma');
    return formattedDate;
}

/**
 * Returns a formatted starting date for an event
 *
 * @param {EventInfo} event The event object
 * @param {boolean} noName True will not print a weekday name (eg. Monday)
 * @returns {string} The formatted starting date
 */
export function getFormattedDate(event, noName = false) {
    if (noName) return event.startDayjs.format('MMMM D, YYYY');
    return event.startDayjs.format('dddd · MMMM D, YYYY');
}

/**
 * Adds dayjs objects an event object
 * @param {EventInfo} event An event object
 */
export function addDayjsElement(e) {
    e.startDayjs = convertToTimeZone(e.start, getTimezone());
    if (e.type === 'event') e.endDayjs = convertToTimeZone(e.end, getTimezone());
}

/**
 * Returns a jsx array of filters
 * @param {object} filters List of filters
 * @param {boolean} filters.limited Limited slots
 * @param {boolean} filters.semester Limited slots
 * @param {boolean} filters.setTimes Limited slots
 * @param {boolean} filters.weekly Weekly signups (with time)
 * @param {string} [signupTime] Time that signup will go up, only needed if weekly is true
 * @returns {JSX.IntrinsicElements[]} jsx array
 */
export function formatVolunteeringFilters(filters, signupTime) {
    var filterObjects = [];
    if (filters.limited)
        filterObjects.push(
            <div key="0" className="filter f-limited">
                Limited Slots
            </div>
        );
    if (filters.semester)
        filterObjects.push(
            <div key="1" className="filter f-semester">
                Semester Long Commitment
            </div>
        );
    if (filters.setTimes)
        filterObjects.push(
            <div key="2" className="filter f-set-times">
                Set Volunteering Times
            </div>
        );
    if (filters.weekly)
        filterObjects.push(
            <div key="3" className="filter f-weekly">
                Weekly Signups [{signupTime}]
            </div>
        );
    return filterObjects;
}

/**
 * Returns the month spelled out and full year
 *
 * @param {number} [offset] Month offset, or 0 if undefined
 * @returns {string} Formated month and year
 */
export function getMonthAndYear(offset = 0) {
    return dayjs().add(offset, 'month').format('MMMM YYYY');
}

/**
 * Converts a dropbox image path to the correct image url
 *
 * @param {string} path Path of file (eg. /7ad67e9c87f78de90d.png)
 */
export function imgUrl(path) {
    if (path.startsWith('/')) return `/static${path}`;
    return path;
}

/**
 * Gets the user timezone by guessing it
 *
 * @return {string} The timezone as a tz database name
 */
export function getTimezone() {
    // TODO: Allow user to manually change timezone
    return 'America/Chicago';
}

/**
 * Pads a date to 2 digits (eg. 1 => '01')
 *
 * @param {number} num Input number
 * @returns {string} The padded number, converted to a string
 */
export function pad(num) {
    if (num < 10) return `0${num}`;
    return `${num}`;
}

/**
 * Checks for error status codes and alerts the user
 * if an error is detected
 *
 * @param {number} status The http status
 * @param {string} [message] The error message to send to the user
 * @returns {boolean} True if there is an error
 */
export function catchError(status, message = '') {
    if (status !== 200) {
        if (message !== '') message = `: ${message}`;
        alert(`${status} Error${message}`);
        return true;
    }
    return false;
}

/**
 * If on an edit page, will redirect the user to the resource that is being edited.
 *
 * @param {Location} location Location object
 */
export function returnToLastLocation(location) {
    location.href = `${location.origin}${location.pathname.substring(5)}${location.search}`;
}

/**
 * @param {number} editDate Milliseconds representing the edit date (UTC)
 * @returns {string} Edit date display string
 */
export function calculateEditDate(editDate) {
    var edit = dayjs(editDate);
    var now = dayjs();
    var diff = 0;
    var unit = '';

    const diffs = ['year', 'month', 'day', 'hour', 'minute'];
    for (var i = 0; i < diffs.length; i++) {
        diff = now.diff(edit, diffs[i]);
        unit = diffs[i];
        if (diff > 0) break;
    }

    return `${diff} ${unit}${diff !== 1 ? 's' : ''} ago`;
}

export function guessDateInput(input) {
    return dayjs(input, ['MMM D, YYYY', 'MMMM D, YYYY', 'YYYY', 'MMMM']).format('MMM D, YYYY');
}

export function getEditMonthAndYear(input, offset = 0) {
    return dayjs(input, 'MMM D, YYYY').add(offset, 'month').format('MMMM YYYY');
}

export function getEditDate(input) {
    return dayjs(input, 'MMM D, YYYY').get('date');
}

export function getDefaulEditDate() {
    return dayjs().format('YYYY-MM-DD');
}

export function getDefaulEditTime(endTime) {
    // Will take next whole hour
    var day = dayjs().second(0).minute(0).add(1, 'hour');

    // Add 1 hour if end time
    if (endTime) day = day.add(1, 'hour');
    return day.format('HH:mm');
}
