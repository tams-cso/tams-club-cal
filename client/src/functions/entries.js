/**
 * An object containing the information for calendar events
 * @param {string} type The type of the event [event or signup]
 * @param {string} name The name of the event
 * @param {string} club The name of the club that is hosting the event
 * @param {string} startDate The date that the event starts
 * @param {string} endDate The date that the event ends
 * @param {string} startTime The time that the event starts
 * @param {string} endTime The time that the event ends
 * @param {string} link The link to the zoom meeting/fb post of the event
 * @param {string} description The description of the event
 * @param {string} addedBy Who added the event
 */
function Event(type, name, club, startDate, endDate, startTime, endTime, link, description, addedBy) {
    this.type = type;
    this.name = name;
    this.club = club;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
    // TODO: Add support for multiple events [make this an array & change name to links]
    this.link = link;
    this.description = description;
    this.addedBy = addedBy;
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

export { Event, Club, Exec, Committee };