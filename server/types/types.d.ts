/** An object containing a specific edited field */
interface Field {
    /** The key for the field (eg. 'name') */
    key: string;

    /** The old value of the field */
    oldValue: object | string;

    /** The new value of the field */
    newValue: object | string;
}

/** An object containing the information for calendar events */
interface EventObject {
    /** The unique UUIDv4 for the event */
    id: string;

    /** The ID assigned by the Google Calendar API to the calendar event */
    eventId: string;

    /** The ID of the user who creates this event */
    editorId: string;

    /** The name of the event */
    name: string;

    /** Type of the event */
    type: EventType;

    /** The name of the club that is hosting the event */
    club: string;

    /** The description of the event */
    description: string;

    /** The time in UTC milliseconds that the event starts */
    start: number;

    /** The time in UTC milliseconds that the event ends */
    end: number;

    /** The value of the location that the event takes place in */
    location: string;

    /** If true, the event will not have an end time */
    noEnd: boolean;

    /** True to show on schedule view/calendar/Google Calendar */
    publicEvent: boolean;

    /** True to show on reservation calendar/check for overlaps */
    reservation: boolean;

    /** Repeating ID for connecting repeating events */
    repeatingId: string;

    /** End repeating date for the event */
    repeatsUntil: number;
}

/** Type of the event, can be used as filter on the event list */
type EventType = 'event' | 'ga' | 'meeting' | 'volunteering' | 'other';

// Type for club image upload
type MulterFile = { buffer: Buffer };
/** An object containing the information for a club */
interface ClubObject {
    /** The unique UUIDv4 for the club */
    id: string;

    /** The name of the club */
    name: string;

    /** True if an advised club, otherwise false for independent club */
    advised: boolean;

    /** Links related to the club */
    links: string[];

    /** Description of the club */
    description: string;

    /** URL of cover image thumbnail */
    coverImgThumbnail: string;

    /** URL of the full-sized cover image */
    coverImg: string;

    /** Array of exec objects */
    execs: Exec[];

    /** Array of committee objects */
    committees: Committee[];
}

/** An object containing the information of an exec */
interface Exec {
    /** The name of the exec */
    name: string;

    /** The postition of the exec */
    position: string;

    /** The description of the exec */
    description: string;

    /** The image URL of the exec */
    img: string;
}

/** An object containing the information of a committee */
interface Committee {
    /** The name of the committee */
    name: string;

    /** The description for the committee */
    description: string;

    /** The names of the committee heads */
    heads: string[];

    /** List of links */
    links: string[];
}

/** An object containing the image blobs for a club to upload */
interface ClubImageBlobs {
    /** Uploaded cover photo for a club */
    coverPhoto: Blob;

    /** All exec profile pictures */
    profilePictures: Blob[];
}

/** An object containing the information for a volunteering opportunity */
interface VolunteeringObject {
    /** The unique UUIDv4 for the volunteering opportunity */
    id: string;

    /** The name of the volunteering opportunity */
    name: string;

    /** The club name that is offering the volunteering opportunity */
    club: string;

    /** Description of the volunteering opportunity */
    description: string;

    /** Object used for filtering volunteering opportunities */
    filters: Filters;
}

/** An object with the filters for a volunteering opportunity */
interface Filters {
    /** True if limited volunteering opportunity */
    limited: boolean;

    /** True if semester long */
    semester: boolean;

    /** True if set volunteering times */
    setTimes: boolean;

    /** True if weekly volunteering opportunity */
    weekly: boolean;

    /** True if open */
    open: boolean;
}

type Resource = 'events' | 'clubs' | 'volunteering';

/** An object containing the information for a single edit to a specific resource */
interface HistoryObject {
    /** The unique UUIDv4 for the history object */
    id: string;

    /** Resource name of the history */
    resource: Resource;

    /** The ID of the original resource */
    resourceId: string;

    /** The time in UTC milliseconds that this edit was made */
    time: number;

    /** The editor of this specific resource */
    editorId: string;

    /** List of fields that were edited */
    fields: Field[];
}

/** Access level of the user */
type AccessLevel = -1 | 0 | 1 | 2;

/** An object containing the information for a single user */
interface UserObject {
    /** ID of the user */
    id: string;

    /** Google Auth unique ID for the user */
    googleId: string;

    /** Email address of the user */
    email: string;

    /** Display name of the user */
    name: string;

    /** Authentication token for this app */
    token: string;

    /** Access level of the user */
    level: AccessLevel;
}
