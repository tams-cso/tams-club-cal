import type { Dayjs } from 'dayjs';

// TODO: Formalize a type of union of constants for location from the data file

/** Access levels for users */
export enum AccessLevel {
    NONE = -1,
    STANDARD = 0,
    CLUBS = 1,
    ADMIN = 2,
}

/** An object containing the information for events */
export interface Event {
    /** The unique UUIDv4 for the event */
    id: string;

    /** The ID assigned by the Google Calendar API to the calendar event */
    eventId: string;

    /** The ID of the user who creates this event */
    editorId: string;

    /** The name of the event */
    name: string;

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
    noEnd?: boolean;

    /** True to show on schedule view/calendar/Google Calendar */
    publicEvent: boolean;

    /** True to show on reservation calendar/check for overlaps */
    reservation: boolean;
}

/**
 * Object to hold data for the reservation view temporarily. This is used
 * when we are displaying reservations on the reservation calendar.
 */
export interface BrokenReservation {
    /** Start time of the reservation block */
    start: Dayjs;

    /** End time of the reservation block */
    end: Dayjs;

    /** How many hours/cells does the reservation span */
    span: number;

    /** Actual reservation data stored here */
    data: Event;
}

/**
 * Object to hold information for a room; this is stored
 * in client/src/data.json
 */
export interface Room {
    /** Internal id of the room */
    value: string;

    /** User-friendly label of the room */
    label: string;
}

/** An object containing the information for a club */
export interface Club {
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
export interface Exec {
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
export interface Committee {
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
export interface ClubImageBlobs {
    /** Uploaded cover photo for a club */
    coverPhoto: Blob;

    /** All exec profile pictures */
    profilePictures: Blob[];
}

/** An object containing the information for a volunteering opportunity */
export interface Volunteering {
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
export interface Filters {
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

/** An object containing a specific feedback object */
export interface Feedback {
    /** The unique UUIDv4 for the feedback */
    id: string;

    /** The actual feedback, as a string */
    feedback: string;

    /** The name of the user who submitted the feedback (optional) */
    name: string;

    /** The time that the feedback was submitted */
    time: number;
}

/** Valid resource types, used in the edit history object */
export type Resource = 'events' | 'clubs' | 'volunteering';

/** An object containing the information for a single edit to a specific resource */
export interface History {
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

/** An object containing the information to display a certain edit in the history list */
export interface HistoryData {
    /** Name of the resource that is edited */
    name: string;

    /** Name of the editor of the resource */
    editor: string;
}

/** The data that is passed when GET /history is called */
export interface HistoryListData {
    /** History object list */
    historyList: History[];

    /** Display data list */
    dataList: HistoryData[];
}

/** The data that is passed when GET /history/[resource]/[id] is called */
export interface HistoryItemData {
    /** List of history items */
    history: History[];

    /** Name of the resource */
    name: string;

    /** List of editors' names */
    editorList: string[];
}

/** An object containing a specific edited field */
export interface Field {
    /** The key for the field (eg. 'name') */
    key: string;

    /** The old value of the field */
    oldValue: object | string;

    /** The new value of the field */
    newValue: object | string;
}

/** Return object for fetch requests */
export interface FetchResponse {
    /** The HTTP status code */
    status: number;

    /** Data of the request */
    data: object | null;
}

// TODO: Apply this to all POST/PUT requests and change responses to 204!
/** Return object for fetch requests that only have a status */
export type StatusResponse = {
    /** The HTTP status code */
    status: number;
};

/** Link data from forms; the deleted field is for lazy deletion of input fields to simplify forms */
export interface LinkInputData {
    /** Actual value of the link */
    value: string;

    /** True if the link is marked to be deleted */
    deleted: boolean;
}

/** Used for getting resources on the admin dashboard */
export interface AdminResource {
    /** Name of the resource */
    name: string;

    /** ID of the resource */
    id: string;
}

/** Event data for when a popup should open */
export interface PopupEvent {
    /** Severity where 0 (none), 1 (info), 2 (success), 3 (warning), and 4 (error) */
    severity: 0 | 1 | 2 | 3 | 4;

    /** String message to display */
    message: string;

    /** Time that popup was activated; this is so same popup can be activated twice w/o clearing state */
    time: number;
}

/** Logged in user data */
export interface User {
    /** ID of the user */
    id: string;

    /** Display name of the user */
    name: string;

    /** Email of the user */
    email: string;

    /** Access level of the user */
    level: AccessLevel;
}

/** Wrapper interface for any text data, such as external-links. This will mostly be from the admin dashboard */
export interface TextData<T> {
    /** Type value of the text data (eg. external-links) */
    type: string;

    /** Data to store */
    data: T;
}

/** List of external links for the site */
export interface ExternalLink {
    /** Display name of the external link */
    name: string;

    /** URL it links to */
    url: string;

    /** ID of the icon to display; see https://fonts.google.com/icons?icon.style=Rounded */
    icon: string;
}

/** List of resources returned by mongoose-paginate-v2 from the backend */
export interface AdminResourceList {
    docs: (Event | Club | Volunteering)[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number;
    nextPage: number;
}
// TODO: comment this using https://www.npmjs.com/package/mongoose-paginate-v2

/** Object that stores data for resource to delete */
export interface DeleteObject {
    /** Resource type to delete */
    resource: Resource;

    /** ID of resource to delete */
    id: string;

    /** Name of resource to delete */
    name: string;
}
