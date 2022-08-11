type AccessLevel = -1 | 0 | 1 | 2;

/** An object containing the information for events */
interface CalEvent {
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
    noEnd?: boolean;

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

/**
 * Object to hold data for the reservation view temporarily. This is used
 * when we are displaying reservations on the reservation calendar.
 */
interface BrokenReservation {
    /** Start time of the reservation block */
    start: number;

    /** End time of the reservation block */
    end: number;

    /** How many hours/cells does the reservation span */
    span: number;

    /** Actual reservation data stored here */
    data: CalEvent;
}

/**
 * Object to hold information for a room; this is stored
 * in client/src/data.json
 */
interface Room {
    /** Internal id of the room */
    value: string;

    /** User-friendly label of the room */
    label: string;
}
