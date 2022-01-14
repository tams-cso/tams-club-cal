import type { Request } from 'express';

/**
 * An object containing the information for an editor.
 * Either the id or ip will contain data, but the id will take precedence.
 */
export interface Editor {
    /** The unique UUIDv4 for the user */
    id?: string;

    /** The ip address of the editor */
    ip?: string;
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

/** An object containing the information for calendar events */
export interface EventObject {
    /** The unique UUIDv4 for the event */
    id: string;

    /** The ID assigned by the Google Calendar API to the calendar event */
    eventId: string;

    /** The ID of the reservation associated with the event */
    reservationId?: string | number;

    /** The type of the event */
    type: 'event' | 'signup';

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

    /** If true, the event will last the entire day, will ignore start/end datetime */
    allDay?: boolean;

    /** If true, the event will not have an end time */
    noEnd?: boolean;

    /** Edit history list */
    history: string[];
}

// Type for club image upload
export type MulterFile = { buffer: Buffer };
export type RequestWithClubFiles = Request & { files: { cover: MulterFile[]; exec: MulterFile[] } };

/** An object containing the information for a club */
export interface ClubObject {
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

    /** Edit history list */
    history: string[];
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
