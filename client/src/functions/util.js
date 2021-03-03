import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import imageCompression from 'browser-image-compression';
import { EventInfo, DateAndTime, CalendarDates, DateDivider } from './entries';
import config from '../files/config.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);

/**
 * Gets query parameters
 * @param {string} query key value to get from the querystring
 * @returns {string | null} The value of the query parameter or null if missing
 */
export function getParams(query) {
    return new URLSearchParams(window.location.search).get(query);
}

/**
 * Parses a time using dayjs and returns the seconds in milliseconds.
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} input String time input for dayjs to parse
 * @param {string} tz Tz database time zone (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * @returns {number} Milliseconds since Jan 1, 1970 [UTC time]
 */
export function parseTimeZone(input, tz) {
    return dayjs.tz(input, 'MMM D, YYYY H:m', tz).valueOf();
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
 * Takes a list of sorted events and injects DateDivider objects into it
 *
 * @param {EventInfo[]} eventList List of events, with an extra dayjs object defined
 */
export function insertDateDividers(eventList) {
    // Current date will store the latest date divider added, to prevent repeats
    var currDate = '';

    // Iterate through the list of sorted events
    for (var i = 0; i < eventList.length; i++) {
        // Create formatted date from the start datetime of the event
        var date = eventList[i].startDayjs.format('YYYY-MM-DD');

        // If the date doesn't have a divider, add it to the list
        if (currDate != date) {
            currDate = date;
            eventList.splice(i, 0, new DateDivider(date));
            i++;
        }
    }
}

/**
 * Converts a date to a readable date section label
 *
 * @param {string} date Date passed in formatted as YYYY-MM-DD
 * @returns {string} Readable date section label
 */
export function createDateHeader(date) {
    return dayjs(date).format('dddd M/D/YY');
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
 * Creates the 3 numerical lists of calendar days, for the current, previous, and next months
 *
 * @param {number} [offset] Month offset (0 if undefined)
 * @param {string} [dateString] The calendar date (MMM D, YYYY)
 * @returns {CalendarDates} Object with lists of calendar dates
 */
export function generateCalendarDays(offset = 0, dateString = '') {
    // Creates a DayJS object from date or offset
    var day = dayjs();
    if (dateString !== '') day = dayjs(dateString, 'MMM D, YYYY');
    day = day.add(offset, 'month').date(1);

    // Creates the dates for the current, previous, and next calendar month
    const current = [],
        previous = [],
        next = [];

    // Iterate through the dates and push numbers into arrays
    for (let i = 1; i <= day.daysInMonth(); i++) current.push(i);
    for (let i = day.day(), j = day.subtract(1, 'month').daysInMonth(); i > 0; i--) previous.unshift(j--);
    for (let i = day.date(day.daysInMonth()).day() + 1, j = 1; i < 7; i++) next.push(j++);

    // Returns an object containing the data
    return new CalendarDates(current, previous, next, day);
}

/**
 * Converts millisecond time to editing date and time
 *
 * @param {number} millis The UTC millisecond time
 * @returns {DateAndTime} The date and time objects
 */
export function millisToDateAndTime(millis) {
    var dayObj = convertToTimeZone(millis, getTimezone());
    return {
        date: dayObj.format('MMM D, YYYY'),
        time: dayObj.format('HH:mm'),
    };
}

/**
 * Adds 'active' or 'inactive' to an element's classname.
 *
 * @param {string} className Base name of the class
 * @param {boolean} state State variable, true would be active
 */
export function isActive(className, state) {
    return `${className} ${state ? 'active' : 'inactive'}`;
}

/**
 * Compresses the image to a specific max width or height
 * Cover Photos: 1728x756
 * Cover Photo Thumbnails: 432x189
 * Exec Profile Pictures: 256x256
 *
 * @param {Blob} imageFile Image file object
 * @param {number} maxWidthOrHeight The max width/height to scale down, in pixels
 * @returns {Promise<Blob>} The compressed image blob
 */
export async function compressUploadedImage(imageFile, maxWidthOrHeight) {
    try {
        console.log(`uncompressed size: ${imageFile.size / 1024 / 1024} MB`);
        const compressed = await imageCompression(imageFile, { maxWidthOrHeight });
        console.log(`compressed size: ${compressed.size / 1024 / 1024} MB`);
        return compressed;
    } catch (error) {
        console.dir(error);
    }
}

/**
 * Converts a dropbox image path to the correct image url
 *
 * @param {string} path Path of file (eg. /7ad67e9c87f78de90d.png)
 */
export function imgUrl(path) {
    if (path.startsWith('/')) return `${config.backend}/static${path}`;
    return path;
}

/**
 * Gets the user timezone by guessing it
 *
 * @return {string} The timezone as a tz database name
 */
export function getTimezone() {
    // TODO: Allow user to manually change timezone
    return dayjs.tz.guess();
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
 * Takes in text and a classname, parses the links, and creates
 * a paragraph element with the links in <a> tags
 *
 * @param {string} className Classname prop to add to outer paragraph element
 * @param {string} text The text to parse and display
 * @returns {object} A React jsx <p> component with links wrapped in <a> tags
 */
export function parseLinks(className, text) {
    const re = /((?:http|https):\/\/.+?)(?:\.|\?|!)?(?:\s|$)/g;
    var m;
    var matches = [];
    do {
        m = re.exec(text);
        if (m) matches.push(m);
    } while (m);

    var tempText = text;
    var outText = [];
    var prevIndex = 0;
    matches.forEach((m) => {
        outText.push(tempText.substring(prevIndex, tempText.indexOf(m[1])));
        outText.push(
            <a key={m[1]} href={m[1]} alt={m[1]}>
                {m[1]}
            </a>
        );
        tempText = tempText.substring(tempText.indexOf(m[1]) + m[1].length);
    });
    outText.push(tempText);

    return <p className={className}>{outText}</p>;
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
    return dayjs().format('MMM D, YYYY');
}

export function getDefaulEditTime(endTime) {
    // Will take next whole hour
    var day = dayjs().second(0).minute(0).add(1, 'hour');
    
    // Add 1 hour if end time
    if (endTime) day = day.add(1, 'hour');
    return day.format('H:mm');
}