/** Valid resource types, used in the edit history object */
type Resource = 'events' | 'clubs' | 'volunteering';

/** An object containing a specific feedback object */
interface Feedback {
    /** The unique UUIDv4 for the feedback */
    id: string;

    /** The actual feedback, as a string */
    feedback: string;

    /** The name of the user who submitted the feedback (optional) */
    name: string;

    /** The time that the feedback was submitted */
    time: number;
}

/** Link data from forms; the deleted field is for lazy deletion of input fields to simplify forms */
interface LinkInputData {
    /** Actual value of the link */
    value: string;

    /** True if the link is marked to be deleted */
    deleted: boolean;
}

/** Event data for when a popup should open */
interface PopupEvent {
    /** Severity where 0 (none), 1 (info), 2 (success), 3 (warning), and 4 (error) */
    severity: 0 | 1 | 2 | 3 | 4;

    /** String message to display */
    message: string;

    /** Time that popup was activated; this is so same popup can be activated twice w/o clearing state */
    time: number;
}

/** Logged in user data */
interface User {
    /** ID of the user */
    id: string;

    /** Display name of the user */
    name: string;

    /** Email of the user */
    email: string;

    /** Access level of the user */
    level: AccessLevel;
}

/** Object that stores data for resource to delete */
interface DeleteObject {
    /** Resource type to delete */
    resource: Resource;

    /** ID of resource to delete */
    id: string;

    /** Name of resource to delete */
    name: string;
}
