import dayjs, { Dayjs } from 'dayjs';

/**
 * An object containing the information for calendar events
 * @param {"event"|"signup"} type The type of the event
 * @param {string} name The name of the event
 * @param {string} club The name of the club that is hosting the event
 * @param {string} start The time in UTC milliseconds that the event starts
 * @param {string} end The time in UTC milliseconds that the event ends
 * @param {string[]} links The link to the zoom meeting/fb post of the event
 * @param {string} description The description of the event
 * @param {string[]} editedBy The editors of the event
 */
export function Event(type, name, club, start, end, links, description, editedBy = []) {
    this.type = type || 'event';
    this.name = name || '';
    this.club = club || '';
    this.start = start || '';
    this.end = end || '';
    this.links = links || [];
    this.description = description || '';
    this.editedBy = editedBy || [];
}

/**
 * An object containing the basic information for an event. This will be displayed in the list/calendar of events
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string} type The type of the event [event or signup]
 * @param {string} name The name of the event
 * @param {string} club The name of the club that is hosting the event
 * @param {number} start The millisecond datetime that the event starts
 * @param {number} end The millisecond datetime that the event ends
 */
export function EventInfo(objId, type, name, club, start, end) {
    this.objId = objId;
    this.type = type;
    this.name = name;
    this.club = club;
    this.start = start;
    this.end = end;
    this.startDayjs = null;
    this.endDayjs = null;
}

/**
 * An object containing the extra data for an event
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string[]} links The link to the zoom meeting/fb post of the event
 * @param {string} description The description of the event
 * @param {string[]} editedBy List of people who edited the event
 */
export function EventData(objId, links, description, editedBy) {
    this.objId = objId;
    this.links = links;
    this.description = description;
    this.editedBy = editedBy;
}

/**
 * An object containing the information for a club
 * @param {string} name The name of the club
 * @param {boolean} advised True if an advised club, otherwise false for independent club
 * @param {string} fb Link to facebook page
 * @param {string} website Link to website
 * @param {string} coverImgThumbnail URL of cover image thumbnail
 * @param {string} coverImg URL of the full-sized cover image
 * @param {string} description Description of the club
 * @param {Exec[]} execs Array of exec objects
 * @param {Committee[]} committees Array of committee objects
 * @param {Object} coverImgBlobs Base64 encoded strings of the cover image
 * @param {string} coverImgBlobs.img The compressed cover image
 * @param {string} coverImgBlobs.thumb The super compressed cover image thumbnail
 * @param {string[]} execProfilePicBlobs Base64 encoded strings of the exec profile pics in the order of the execs (null if missing)
 * @param {string[]} editedBy The editors of the event
 */
export function Club(
    name,
    advised,
    fb,
    website,
    coverImgThumbnail,
    coverImg,
    description,
    execs,
    committees,
    coverImgBlobs = null,
    execProfilePicBlobs = null,
    editedBy
) {
    this.name = name || '';
    this.advised = advised || false;
    this.fb = fb || '';
    this.website = website || '';
    this.coverImgThumbnail = coverImgThumbnail || '';
    this.coverImg = coverImg || '';
    this.description = description || '';
    this.execs = execs || [new Exec()];
    this.committees = committees || [new Committee()];
    this.coverImgBlobs = coverImgBlobs || [];
    this.execProfilePicBlobs = execProfilePicBlobs || [];
    this.editedBy = editedBy || [];
}

/**
 * An object containing the basic information for a club, to be displayed in the list view of all clubs
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string} name The name of the club
 * @param {boolean} advised True if an advised club, otherwise false for independent club
 * @param {string} fb Link to facebook page
 * @param {string} website Link to website
 * @param {string} coverImgThumbnail URL of cover image thumbnail
 */
export function ClubInfo(objId, name, advised, fb, website, coverImgThumbnail) {
    this.objId = objId;
    this.name = name;
    this.advised = advised;
    this.fb = fb;
    this.website = website;
    this.coverImgThumbnail = coverImgThumbnail;
}

/**
 * An object containing the data for a club
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string} infoId ID of the club, used for getting full club info
 * @param {string} description Description of the club
 * @param {Exec[]} execs Array of exec objects
 * @param {Committee[]} committee Array of committee objects
 * @param {string} coverImg URL of the full-sized cover image
 * @param {string[]} editedBy The editors of the event
 */
export function ClubData(infoId, description, execs, committee, coverImg, editedBy) {
    this.objId = objId;
    this.infoId = infoId;
    this.description = description;
    this.execs = execs;
    this.committee = committee;
    this.coverImg = coverImg;
    this.editedBy = editedBy;
}

/**
 * An object containing the information for a volunteering opportunity
 * @param {string} name The name of the volunteering opportunity
 * @param {string} club The club name that is offering the volunteering opportunity
 * @param {string} description Description of the volunteering opportunity
 * @param {Object} filters Object used for filtering volunteering opportunities
 * @param {boolean} filters.limited True if limited slots, otherwise false
 * @param {boolean} filters.senester True if semester long sommitment, otherwise false
 * @param {boolean} filters.setTimes True if set volunteering time, otherwise false
 * @param {boolean} filters.weekly True if there are weekly signups, otherwise false
 * @param {boolean} filters.open True if volunteering opportunity is currently available, otherwise false
 * @param {string} signupTime Time of weekly signups, null if no weekly signups
 * @param {string[]} editedBy The editors of the event
 */
export function Volunteering(name, club, description, filters, signupTime, editedBy) {
    this.name = name || '';
    this.club = club || '';
    this.description = description || '';
    this.filters = filters || { limited: false, semester: false, setTimes: false, weekly: false, open: true };
    this.signupTime = signupTime || '';
    this.editedBy = editedBy || [];
}

/**
 * An object containing the information of an exec
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
 * @param {string} name The name of the committee
 * @param {string} description The description for the committee
 * @param {string} fb The facebook link of the committee
 * @param {string} website The website link of the committee
 */
export function Committee(name, description, fb, website) {
    this.name = name || '';
    this.description = description || '';
    this.fb = fb || '';
    this.website = website || '';
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
 * @param {Dayjs} dateObj DayJS Date object
 */
export function CalendarDates(current, previous, next, dateObj) {
    this.current = current;
    this.previous = previous;
    this.next = next;
    this.dateObj = dateObj;
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
    this.objId = '';
}

/**
 * @typedef {Object} DateAndTime
 * @property {string} date The date in the format (YYYY-MM-DD)
 * @property {string} time The time in the format (HH:MM)
 */
