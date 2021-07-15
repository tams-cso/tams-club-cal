import { Dayjs } from 'dayjs';

/**
 * An object containing the information for calendar events
 *
 * @param {string} id The unique UUIDv4 for the event
 * @param {string} eventId The ID assigned by the Google Calendar API to the calendar event
 * @param {"event"|"signup"} type The type of the event
 * @param {string} name The name of the event
 * @param {string} club The name of the club that is hosting the event
 * @param {string} description The description of the event
 * @param {Number} start The time in UTC milliseconds that the event starts
 * @param {Number} end The time in UTC milliseconds that the event ends
 */
export function Event(id, eventId, type, name, description, club, start, end) {
    this.id = id || '';
    this.eventId = eventId || '';
    this.type = type || 'event';
    this.name = name || '';
    this.club = club || '';
    this.description = description || '';
    this.start = start || '';
    this.end = end || '';
}

/**
 * An object containing the information for a club
 *
 * @param {string} id The unique UUIDv4 for the club
 * @param {string} name The name of the club
 * @param {boolean} advised True if an advised club, otherwise false for independent club
 * @param {string[]} links Links related to the club
 * @param {string} description Description of the club
 * @param {string} coverImgThumbnail URL of cover image thumbnail
 * @param {string} coverImg URL of the full-sized cover image
 * @param {Exec[]} execs Array of exec objects
 * @param {Committee[]} committees Array of committee objects
 */
export function Club(id, name, advised, links, description, coverImgThumbnail, coverImg, execs, committees) {
    this.id = id || '';
    this.name = name || '';
    this.advised = advised || false;
    this.links = links || [];
    this.fb = fb || '';
    this.website = website || '';
    this.description = description || '';
    this.coverImgThumbnail = coverImgThumbnail || '';
    this.coverImg = coverImg || '';
    this.execs = execs || [];
    this.committees = committees || [];
}

/**
 * An object containing the information of an exec
 *
 * @param {string} name The name of the exec
 * @param {string} position The postition of the exec
 * @param {string} description The description of the exec
 * @param {string} img The image URL of the exec
 */
export function Exec(name, position, description, img) {
    this.name = name || '';
    this.position = position || '';
    this.description = description || '';
    this.img = img || '';
}

/**
 * An object containing the information of a committee
 *
 * @param {string} name The name of the committee
 * @param {string} description The description for the committee
 * @param {string[]} heads The names of the committee heads
 * @param {string} fb The facebook link of the committee
 * @param {string} website The website link of the committee
 */
export function Committee(name, description, heads, fb, website) {
    this.name = name || '';
    this.description = description || '';
    this.heads = heads || '';
    this.fb = fb || '';
    this.website = website || '';
}

/**
 * An object containing the information for a volunteering opportunity
 *
 * @param {string} name The name of the volunteering opportunity
 * @param {string} club The club name that is offering the volunteering opportunity
 * @param {string} description Description of the volunteering opportunity
 * @param {Filters} filters Object used for filtering volunteering opportunities
 * @param {string} signupTime Time of weekly signups, null if no weekly signups
 */
export function Volunteering(name, club, description, filters, signupTime) {
    this.name = name || '';
    this.club = club || '';
    this.description = description || '';
    this.filters = filters || new Filters();
    this.signupTime = signupTime || '';
}

/**
 * An object with the filters for a volunteering opportunity
 *
 * @param {boolean} limited True if limited volunteering opportunity
 * @param {boolean} semester True if semester long
 * @param {boolean} setTimes True if set volunteering times
 * @param {boolean} weekly True if weekly volunteering opportunity
 * @param {boolean} open True if open
 */
export function Filters(limited, semester, setTimes, weekly, open) {
    this.limited = limited || false;
    this.semester = semester || false;
    this.setTimes = setTimes || false;
    this.weekly = weekly || false;
    this.open = open || false;
}

/**
 * Return object for fetch requests
 * @param {number} status The HTTP status code
 * @param {object} data Data of the request
 */
export function FetchResponse(status, data) {
    this.status = status;
    this.data = data;
}

/**
 * Holds the list of numbered dates for the calendar to +/- 1 month
 *
 * @param {number[]} current List of dates in the current month
 * @param {number[]} previous List of dates in the previous month
 * @param {number[]} next List of dates in the next month
 * @param {Dayjs} dayObj The dayjs object containing the current date
 */
export function CalendarDates(current, previous, next, dayObj) {
    this.current = current;
    this.previous = previous;
    this.next = next;
    this.dayObj = dayObj;
}

/**
 * A date divider object to be parsed by the home event list creator
 * The object ID will be set to an empty string to differentiate
 * between the EventInfo objects
 *
 * @param {string} date Date formatted as YYYY-MM-DD
 */
export function DateDivider(date) {
    this.date = date;
    this.id = '';
}

/**
 * @typedef {Object} DateAndTime
 * @property {string} date The date in the format (YYYY-MM-DD)
 * @property {string} time The time in the format (HH:MM)
 */
