import dayjs from 'dayjs';

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
    filters: Filters = createFilters()
): Volunteering {
    return { id, name, club, description, filters };
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
    committees: Committee[] = []
): Club {
    return { id, name, advised, links, description, coverImgThumbnail, coverImg, execs, committees };
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
 * Creates an Event object
 */
export function createEvent(
    id: string = null,
    eventId: string = null,
    editorId: string = null,
    name: string = '',
    type: EventType = 'event',
    club: string = '',
    description: string = '',
    start: number = dayjs().startOf('hour').add(1, 'hour').valueOf(),
    end: number = dayjs().startOf('hour').add(2, 'hour').valueOf(),
    location: string = 'none',
    noEnd: boolean = false,
    publicEvent: boolean = false,
    reservation: boolean = false,
    repeatingId: string = null,
    repeatsUntil: number = null,
): CalEvent {
    return {
        id,
        eventId,
        editorId,
        name,
        type,
        club,
        description,
        start,
        end,
        location,
        noEnd,
        publicEvent,
        reservation,
        repeatingId,
        repeatsUntil,
    };
}

/** Creates a TextData object */
export function createTextData<T>(type: string = '', data: T): TextData<T> {
    return { type, data };
}

/** Creates an ExternalLink object */
export function createExternalLink(name: string = '', url: string = '', icon: string = ''): ExternalLink {
    return { name, url, icon };
}
