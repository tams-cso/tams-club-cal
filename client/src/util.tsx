import type {
    Event,
    Editor,
    LinkInputData,
    Reservation,
    PopupEvent,
    Volunteering,
    Filters,
    Club,
    Exec,
    Committee,
    ClubImageBlobs,
} from './types';
import { RepeatingStatus } from './types';
import type { Theme } from '@mui/material';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Link from './components/shared/Link';
import { getUserById } from './api';

// Plugins for dayjs base library
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);

// ================== MISC UTIL FUNCTIONS =================== //

/**
 * Gets a query parameter given the key
 */
export function getParams(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Takes in text and a classname, parses the links, and creates
 * a Fragment with the links in Link elements. Uses a regular expression
 * to parse links in paragraphs -- must begin with http or https.
 *
 * @param text The text to parse and display
 * @returns A React jsx fragment containing text and link components
 */
export function parseLinks(text: string): React.ReactFragment {
    const re = /((?:http|https):\/\/.+?)(?:\.|\?|!)?(?:\s|$)/g;
    let m: RegExpExecArray;
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
            <Link key={m[1]} href={m[1]} target="_blank">
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
 */
export function redirect(path: string): void {
    window.location.href = `${window.location.origin}${path}`;
}

/**
 * This function will remove all deleted links and return
 * a string list of the values, with the empty ones removed
 *
 * @param list List of link objects with deleted and value attributes
 */
export function processLinkObjectList(list: LinkInputData[]): string[] {
    if (!list) return [];
    return list.filter((l) => !l.deleted && l.value.trim() !== '').map((l) => l.value);
}

// ================== CSS AND MUI FUNCTIONS =================== //

/**
 * Sets a style depending on whether or not the theme is light/dark
 *
 * @param theme The Mui theme object
 * @param lightStyle Light theme style
 * @param darkStyle Dark theme style
 * @returns Either the dark or light theme style, depending on the current mode
 */
export function darkSwitch(theme: Theme, lightStyle: string, darkStyle: string): string {
    return theme.palette.mode === 'light' ? lightStyle : darkStyle;
}

/**
 * Sets a grey (400/600) depending on whether or not the theme is light/dark
 *
 * @param theme The Mui theme object
 * @returns grey[600] for light theme and grey[400] for dark theme
 */
export function darkSwitchGrey(theme: Theme): string {
    return darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]);
}

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

/**
 * Formats the full date of the event.
 * Includes an end date if not the same as the start date.
 *
 * @param event The activity object
 * @returns The formatted full date
 */
export function formatEventDate(event: Event): string {
    if (!toTz(event.start).isSame(toTz(event.end), 'day')) return formatTime(event.start, 'dddd, MMMM D, YYYY h:mma');
    let formattedTime = formatTime(event.start, 'dddd, MMMM D, YYYY');
    if (!isSameDate(event.start, event.end)) formattedTime += formatTime(event.end, ' - dddd, MMMM D, YYYY');
    return formattedTime;
}

/**
 * Formats the time of the event.
 * Includes an end time if not the same as the start time.
 *
 * @param event The activity object
 * @param noEnd If true, will not show an end time
 * @param checkSame If true, will check to see if start !== end and return the end time. This is used for the EventDisplay component
 * @returns The formatted time for the event in the format [h:mma - h:mma]
 */
export function formatEventTime(event: Event, noEnd: boolean = false, checkSame: boolean = false): string {
    if (event.allDay) return 'Full Day';
    if (checkSame && !toTz(event.start).isSame(toTz(event.end), 'day'))
        return formatTime(event.end, 'dddd, MMMM D, YYYY h:mma');

    let formattedTime = formatTime(event.start, 'h:mma', true);
    if (!noEnd && event.start !== event.end) formattedTime += ` - ${formatTime(event.end, 'h:mma', true)}`;
    return formattedTime;
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
function isNotMidnight(time: number): 0 | 1 {
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

// ================== DATA PARSING FUNCTIONS =================== //

/**
 * Will split up multiple day events to be displayed correctly.
 * This will essentially create a new event for each day of the multi-day event.
 *
 * @param eventList The unparsed event list
 * @returns The event list with split up events across days
 */
export function parsePublicEventList(eventList: Event[]): Event[] {
    const outputList = [];
    eventList.forEach((a) => {
        // Simply return the event if it does not span across multiple days
        if (dayjs(a.start).isSame(dayjs(a.end), 'day') || a.allDay || isNotMidnight(a.end) === 0) {
            outputList.push(a);
            return;
        }

        // Calculate how many days the events span
        let currDate = dayjs(a.start);
        const span = dayjs(a.end).diff(currDate, 'day') + isNotMidnight(a.start) + isNotMidnight(a.end);

        // Iterate through the days and set the display start/end times
        for (let day = 1; day <= span; day++) {
            const currEnd = day === span ? dayjs(a.end) : currDate.add(1, 'day').startOf('day');
            outputList.push({
                ...a,
                start: currDate.valueOf(),
                end: currEnd.valueOf(),
                name: `${a.name} (Day ${day}/${span})`,
                allDay:
                    (day !== 1 && day !== span) ||
                    (day === 1 && isNotMidnight(a.start) === 0) ||
                    (day === span && isNotMidnight(a.end) === 0),
            });
            currDate = currEnd;
        }
    });
    return outputList.sort((a, b) => a.start - b.start);
}

/**
 * Will parse the editor object into a readable string depending
 * on the stored values. Will also display "N/A" for invalid objects or values
 *
 * @param editor The editor object
 * @returns The parsed editor to display
 */
export async function parseEditor(editor: Editor): Promise<string> {
    if (!editor) return 'N/A';
    if (editor.id === null) return editor.ip;

    const editorRes = await getUserById(editor.id);
    if (editorRes.status !== 200) return 'N/A';
    return editorRes.data.name;
}

// ================== OBJECT CONSTRUCTORS =================== //

/**
 * Creates a PopupEvent object
 *
 * @param severity Severity where 0 (none), 1 (info), 2 (success), 3 (warning), and 4 (error)
 * @param message String message to display
 */
export function createPopupEvent(message: string, severity: 0 | 1 | 2 | 3 | 4): PopupEvent {
    return { severity, message, time: dayjs().valueOf() };
}

/**
 * Creates a connection error popup
 */
export function createConnectionErrorPopup(): PopupEvent {
    return createPopupEvent('Could not connect to the server. Please check your connection and refresh the page.', 4);
}

/**
 * Creates a Volunteering object
 */
export function createVolunteering(
    id: string = null,
    name: string = '',
    club: string = '',
    description: string = '',
    filters: Filters = createFilters(),
    history: string[] = null
): Volunteering {
    return { id, name, club, description, filters, history };
}

/**
 * Creates a Club object
 */
export function createClub(
    id: string = null,
    name: string = '',
    advised: boolean = false,
    links: string[] = [''],
    description: string = '',
    coverImgThumbnail: string = '',
    coverImg: string = '',
    execs: Exec[] = [],
    committees: Committee[] = [],
    history: string[] = null
): Club {
    return { id, name, advised, links, description, coverImgThumbnail, coverImg, execs, committees, history };
}

/**
 * Creates an Exec object
 */
export function createExec(
    name: string = null,
    position: string = '',
    description: string = '',
    img: string = ''
): Exec {
    return { name, position, description, img };
}

/**
 * Creates a Committee object
 */
export function createCommittee(
    name: string = null,
    description: string = '',
    heads: string[] = [],
    links: string[] = []
): Committee {
    return { name, description, heads, links };
}

/**
 * Creates a ClubImageBlobs object
 */
export function createClubImageBlobs(coverPhoto: Blob = null, profilePictures: Blob[] = []): ClubImageBlobs {
    return { coverPhoto, profilePictures };
}

/**
 * Creates a Filters object
 */
export function createFilters(
    limited: boolean = false,
    semester: boolean = false,
    setTimes: boolean = false,
    weekly: boolean = false,
    open: boolean = true
): Filters {
    return { limited, semester, setTimes, weekly, open };
}

/**
 * Creates a Reservation object
 */
export function createReservation(
    id: string = null,
    eventId: string = null,
    name: string = '',
    club: string = '',
    description: string = '',
    start: number = 0,
    end: number = 0,
    location: string = 'none',
    allDay: boolean = false,
    repeatEnd: number = null,
    history: string[] = null
): Reservation {
    return { id, eventId, name, club, description, start, end, location, allDay, repeatEnd, history };
}

/**
 * Creates an Event object
 */
export function createEvent(
    id: string = null,
    eventId: string = null,
    type: string = 'Event',
    name: string = '',
    club: string = '',
    description: string = '',
    start: number = dayjs().startOf('hour').add(1, 'hour').valueOf(),
    end: number = dayjs().startOf('hour').add(2, 'hour').valueOf(),
    location: string = 'none',
    noEnd: boolean = false,
    allDay: boolean = false,
    repeats: RepeatingStatus = RepeatingStatus.NONE,
    repeatsUntil: number = null,
    repeatOriginId: string = null,
    publicEvent: boolean = true,
    reservation: boolean = false,
    history: string[] = null
): Event {
    return {
        id,
        eventId,
        type,
        name,
        club,
        description,
        start,
        end,
        location,
        noEnd,
        allDay,
        repeats,
        repeatsUntil,
        repeatOriginId,
        publicEvent,
        reservation,
        history,
    };
}
