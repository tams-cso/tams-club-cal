/**
 * An object containing the information for calendar events
 * @param {"event"|"signup"} type The type of the event
 * @param {string} name The name of the event
 * @param {string} club The name of the club that is hosting the event
 * @param {string} start The time in UTC milliseconds that the event starts
 * @param {string} end The time in UTC milliseconds that the event ends
 * @param {string[]} links The link to the zoom meeting/fb post of the event
 * @param {string} description The description of the event
 * @param {string} addedBy Who added the event
 */
function Event(type, name, club, start, end, links, description, addedBy) {
    this.type = type;
    this.name = name;
    this.club = club;
    this.start = start;
    this.end = end;
    this.links = links;
    this.description = description;
    this.addedBy = addedBy;
    this.editedBy = "";
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
function EventInfo(objId, type, name, club, start, end) {
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
 * @param {string} addedBy Who added the event
 * @param {string[]} editedBy List of people who edited the event
 */
function EventData(objId, links, description, addedBy, editedBy) {
    this.objId = objId;
    this.links = links;
    this.description = description;
    this.addedBy = addedBy;
    this.editedBy = editedBy;
}

/**
 * An object containing the information for a club
 * @param {string} name The name of the club
 * @param {boolean} advised True if an advised club, otherwise false for independent club
 * @param {string} fb Link to facebook page
 * @param {string} website Link to website
 * @param {string} coverImg URL of cover image
 * @param {string} description Description of the club
 * @param {Exec[]} execs Array of exec objects
 * @param {Committee[]} committee Array of committee objects
 */
function Club(name, advised, fb, website, coverImg, description, execs, committee) {
    this.name = name;
    this.advised = advised;
    this.fb = fb;
    this.website = website;
    this.coverImg = coverImg;
    this.description = description;
    this.execs = execs;
    this.committee = committee;
}

/**
 * An object containing the basic information for a club, to be displayed in the list view of all clubs
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string} name The name of the club
 * @param {boolean} advised True if an advised club, otherwise false for independent club
 * @param {string} fb Link to facebook page
 * @param {string} website Link to website
 * @param {string} coverImg URL of cover image
 */
function ClubInfo(objId, name, advised, fb, website, coverImg) {
    this.objId = objId;
    this.name = name;
    this.advised = advised;
    this.fb = fb;
    this.website = website;
    this.coverImg = coverImg;
}

/**
 * An object containing the data for a club
 * @param {string} objId The unique ID to match the info and data objects
 * @param {string} infoId ID of the club, used for getting full club info
 * @param {string} description Description of the club
 * @param {Exec[]} execs Array of exec objects
 * @param {Committee[]} committee Array of committee objects
 */
function ClubData(infoId, description, execs, committee) {
    this.objId = objId;
    this.infoId = infoId;
    this.description = description;
    this.execs = execs;
    this.committee = committee;
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
 */
function Volunteering(name, club, description, filters, signupTime) {
    this.name = name;
    this.club = club;
    this.description = description;
    this.filters = filters;
    this.signupTime = signupTime;
}

/**
 * An object containing the information of an exec
 * @param {string} name The name of the exec
 * @param {string} position The postition of the exec
 * @param {string} description The description of the exec
 * @param {string} image The image URL of the exec
 */
function Exec(name, position, description, image) {
    this.name = name;
    this.position = position;
    this.description = description;
    this.image = image;
}

/**
 * An object containing the information of a committee
 * @param {string} name The name of the committee
 * @param {string} description The description for the committee
 * @param {string} fb The facebook link of the committee
 * @param {string} website The website link of the committee
 */
function Committee(name, description, fb, website) {
    this.name = name;
    this.description = description;
    this.fb = fb;
    this.website = website;
}

export { Event, EventInfo, EventData, Club, ClubInfo, ClubData, Volunteering, Exec, Committee };
