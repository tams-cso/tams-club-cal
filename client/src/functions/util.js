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

// ================== MISC UTIL FUNCTIONS =================== //

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
    if (!list) return [];
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
 * @returns {string} The formatted full date
 */
export function formatEventDate(event) {
    let formattedTime = formatTime(event.start, 'dddd, MMMM D, YYYY');
    if (!isSameDate(event.start, event.end)) formattedTime += formatTime(event.end, ' - dddd, MMMM D, YYYY');
    return formattedTime;
}

/**
 * Formats the time of the event.
 * Includes an end time if not the same as the start time.
 *
 * @param {Event} event The event object
 * @param {boolean} [noEnd] If true, will not show an end time
 * @returns {string} The formatted time for the event in the format [h:mma - h:mma]
 */
export function formatEventTime(event, noEnd = false) {
    let formattedTime = formatTime(event.start, 'h:mma');
    if (!noEnd && event.start !== event.end) formattedTime += formatTime(event.end, ' - h:mma');
    return formattedTime;
}

// ================== DATA PARSING FUNCTIONS =================== //

/**
 * Will set times for all day events as well as split up
 * multiple day events to be displayed correctly
 * 
 * @param {Event[]} eventList The unparsed event list
 * @returns {Event[]} The parsed event list
 */
export function parseEventList(eventList) {
    return eventList.map(e => {
        if (true) return e;
    })
}
