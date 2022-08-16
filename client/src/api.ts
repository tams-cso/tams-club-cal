import type { GridFilterItem } from '@mui/x-data-grid';
import { getCookie } from './util/cookies';

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND === 'staging'
        ? 'https://dev.tams.club'
        : process.env.NODE_ENV === 'production'
        ? 'https://api.tams.club'
        : 'http://localhost:5000';

const CDN_URL =
    process.env.NEXT_PUBLIC_BACKEND === 'staging' || process.env.NODE_ENV !== 'production'
        ? 'https://staging.cdn.tams.club'
        : 'https://cdn.tams.club';

interface ListFetchResponse<T> extends FetchResponse {
    data: T[];
}

interface ResourceFetchResponse<T extends object> extends FetchResponse {
    data: T;
}

/**
 * Performs a GET request to the given endpoint.
 * This function will wrap the data in a FetchResponse object.
 *
 * @param url API endpoint to GET
 * @param auth True if adding token
 */
async function getRequest(url: string, auth: boolean = false): Promise<FetchResponse> {
    try {
        const res = await fetch(`${BACKEND_URL}${url}`, { headers: createHeaders(auth, false) });
        const data = await res.json();
        return <FetchResponse>{ status: res.status, data };
    } catch (error) {
        console.dir(error);
        return <FetchResponse>{ status: 404, data: null };
    }
}

/**
 * Performs a POST request to the given endpoint.
 * This function will wrap the data in a StatusResponse object.
 *
 * @param url API endpoint to POST
 * @param body POST body content
 * @param json Adds a JSON content type header if true
 * @param auth True if adding token
 * @param fetchRes True if the endpoint returns data
 */
async function postRequest(
    url: string,
    body: BodyInit,
    json: boolean = true,
    auth: boolean = true,
    fetchRes: boolean = false
): Promise<StatusResponse | FetchResponse> {
    try {
        const options: RequestInit = {
            method: 'POST',
            body,
            headers: createHeaders(auth, json),
        };

        const res = await fetch(`${BACKEND_URL}${url}`, options);
        return fetchRes
            ? <FetchResponse>{ status: res.status, data: await res.json() }
            : <StatusResponse>{ status: res.status };
    } catch (error) {
        console.dir(error);
        return fetchRes ? <FetchResponse>{ status: 404, data: null } : <StatusResponse>{ status: 404 };
    }
}

/**
 * Performs a PUT request to the given endpoint.
 * This function will wrap the data in a StatusResponse object.
 *
 * @param url API endpoint to PUT
 * @param body POST body content
 * @param json Adds a JSON content type header if true
 * @param auth True if adding token
 */
async function putRequest(
    url: string,
    body: BodyInit,
    json: boolean = true,
    auth: boolean = true
): Promise<StatusResponse> {
    try {
        const options = { method: 'PUT', body, headers: createHeaders(auth, json) };

        const res = await fetch(`${BACKEND_URL}${url}`, options);
        return <StatusResponse>{ status: res.status };
    } catch (error) {
        console.dir(error);
        return <StatusResponse>{ status: 404 };
    }
}

/**
 * Performs a DELETE request to the given endpoint.
 * This function will wrap the data in a FetchResponse object.
 *
 * @param url API endpoint to GET
 * @param auth True if adding token
 */
async function deleteRequest(url: string, auth: boolean = true): Promise<StatusResponse> {
    try {
        const res = await fetch(`${BACKEND_URL}${url}`, { method: 'DELETE', headers: createHeaders(auth, false) });
        return <StatusResponse>{ status: res.status };
    } catch (error) {
        console.dir(error);
        return <StatusResponse>{ status: 404 };
    }
}

/**
 * Creates the header object for fetch requests.
 *
 * @param auth True if adding authorization string
 * @param json True if adding json content type
 */
function createHeaders(auth: boolean, json: boolean): Headers {
    const tokenCookies = getCookie('token');
    const token = tokenCookies ? tokenCookies['token'] : null;

    let headers = new Headers();
    if (auth && token) headers.set('Authorization', `Bearer ${token}`);
    if (json) headers.set('Content-Type', 'application/json');
    headers.set('Referer', 'https://tams.club');
    return headers;
}

/* #################### EVENTS API ##################### */

/**
 * Gets the list of public events.
 */
export async function getPublicEventList(): Promise<ListFetchResponse<CalEvent>> {
    return getRequest('/events') as Promise<ListFetchResponse<CalEvent>>;
}

/**
 * Returns a list of public events between two dates
 *
 * @param start Starting time to get events from
 * @param end Ending time to get events to
 */
export async function getPublicEventListInRange(start: number, end: number): Promise<ListFetchResponse<CalEvent>> {
    return getRequest(`/events?start=${start}&end=${end}`) as Promise<ListFetchResponse<CalEvent>>;
}

/**
 * Gets a specific event by ID.
 *
 * @param id ID of the event to get
 */
export async function getEvent(id: string): Promise<ResourceFetchResponse<CalEvent>> {
    return getRequest(`/events/${id}`) as Promise<ResourceFetchResponse<CalEvent>>;
}

/**
 * Gets the list of all reservations in a week
 * If week is not defined, will get the current week's reservations by default
 *
 * @param week UTC time for the current week to get; this can be any time within the week
 */
export async function getReservationList(week: number = null): Promise<ListFetchResponse<CalEvent>> {
    return getRequest(`/events/reservations/${week ? week : ''}`) as Promise<ListFetchResponse<CalEvent>>;
}

/**
 * Gets the list of all reservations for a specific room in a specific month
 * 
 * @param room Location to search
 * @param month Month to show
 */
export async function getRoomReservationList(room: string, month: number = null): Promise<ListFetchResponse<CalEvent>> {
    return getRequest(`/events/reservations/room/${room}/${month ? month : ''}`) as Promise<ListFetchResponse<CalEvent>>;
}

/**
 * Gets the list of all events that the user created
 */
export async function getUserEvents(token: string): Promise<ListFetchResponse<CalEvent>> {
    return getRequest(`/events/user/${token}`) as Promise<ListFetchResponse<CalEvent>>;
}

// Define extra types for event POST/PUT
type CalEventPost = CalEvent & { repeatsUntil: number };
type CalEventPut = CalEvent & { editAll: boolean };

/**
 * Creates a new event
 *
 * @param event Event object
 */
export async function postEvent(event: CalEventPost): Promise<StatusResponse> {
    return postRequest('/events', JSON.stringify(event));
}

/**
 * Updates an event
 *
 * @param event Event object
 * @param id ID of the event to update
 */
export async function putEvent(event: CalEventPut, id: string): Promise<StatusResponse> {
    return putRequest(`/events/${id}`, JSON.stringify(event));
}

/**
 * Looks for reservations that overlap a specified time range
 *
 * @param location Location to check
 * @param start UTC millisecond start time to search
 * @param end UTC millisecond end time to search
 */
export async function getOverlappingReservations(
    location: string,
    start: number,
    end: number
): Promise<ListFetchResponse<CalEvent>> {
    return getRequest(`/events/reservations/search/${location}/${start}/${end}`) as Promise<
        ListFetchResponse<CalEvent>
    >;
}

/**
 * Deletes a given event by ID
 *
 * @param id ID of event to delete
 */
export async function deleteEvent(id: string): Promise<StatusResponse> {
    return deleteRequest(`/events/${id}`);
}

/**
 * Deletes a repeating event by the repeatingId
 *
 * @param id Repeating ID of the events to delete
 */
export async function deleteRepeatingEvents(id: string): Promise<StatusResponse> {
    return deleteRequest(`/events/repeating/${id}`);
}

/* #################### CLUBS API ##################### */

/**
 * Gets the list of all clubs.
 */
export async function getClubList(): Promise<ListFetchResponse<Club>> {
    return getRequest('/clubs') as Promise<ListFetchResponse<Club>>;
}

/**
 * Gets a specific club by ID.
 */
export async function getClub(id: string): Promise<ResourceFetchResponse<Club>> {
    return getRequest(`/clubs/${id}`) as Promise<ResourceFetchResponse<Club>>;
}

/**
 * Creates a new club.
 *
 * @param club Club object
 * @param images Club image blobs object
 * @param execPhotos True for the execs that have new images; should be same length as club.execs
 */
export async function postClub(club: Club, images: ClubImageBlobs, execPhotos: boolean[]): Promise<StatusResponse> {
    const data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('cover', images.coverPhoto);
    data.append('execPhotos', JSON.stringify(execPhotos));
    images.profilePictures.forEach((p) => {
        data.append('exec', p);
    });
    return postRequest('/clubs', data, false);
}

/**
 * Updates a club
 *
 * @param club Club object
 * @param images Club image blobs object
 * @param execPhotos True for the execs that have new images; should be same length as club.execs
 * @param id ID of the club to update
 */
export async function putClub(
    club: Club,
    images: ClubImageBlobs,
    execPhotos: boolean[],
    id: string
): Promise<StatusResponse> {
    const data = new FormData();
    data.append('data', JSON.stringify(club));
    data.append('cover', images.coverPhoto);
    data.append('execPhotos', JSON.stringify(execPhotos));
    images.profilePictures.forEach((p) => {
        data.append('exec', p);
    });
    return putRequest(`/clubs/${id}`, data, false);
}

/**
 * Deletes a given club by ID
 *
 * @param id ID of club to delete
 */
export async function deleteClub(id: string): Promise<StatusResponse> {
    return deleteRequest(`/clubs/${id}`);
}

/* #################### VOLUNTEERING API ##################### */

/**
 * Gets the list of all volunteering opportunities.
 */
export async function getVolunteeringList(): Promise<ListFetchResponse<Volunteering>> {
    return getRequest('/volunteering') as Promise<ListFetchResponse<Volunteering>>;
}

/**
 * Gets a specific volunteering opportunity by ID.
 */
export async function getVolunteering(id: string): Promise<ResourceFetchResponse<Volunteering>> {
    return getRequest(`/volunteering/${id}`) as Promise<ResourceFetchResponse<Volunteering>>;
}

/**
 * Creates a new volunteering opportunity
 *
 * @param volunteering Volunteering object
 */
export async function postVolunteering(volunteering: Volunteering): Promise<StatusResponse> {
    return postRequest(`/volunteering`, JSON.stringify(volunteering));
}

/**
 * Updates a volunteering opportunity
 *
 * @param volunteering Volunteering object
 * @param id ID of the volunteering opportunity to update
 */
export async function putVolunteering(volunteering: Volunteering, id: string): Promise<StatusResponse> {
    return putRequest(`/volunteering/${id}`, JSON.stringify(volunteering));
}

/**
 * Deletes a given volunteering opportunity by ID
 *
 * @param id ID of event to delete
 */
export async function deleteVolunteering(id: string): Promise<StatusResponse> {
    return deleteRequest(`/volunteering/${id}`);
}

/* #################### HISTORY API #################### */

/**
 * Gets the list of history objects starting from the start ID.
 * If no ID is defined, this will return the last 50 edits.
 *
 * @param start The ID of the oldest edit to start retrieving from
 */
export async function getHistoryList(start?: string): Promise<ResourceFetchResponse<HistoryListData>> {
    return getRequest(`/history${start ? `?start=${start}` : ''}`) as Promise<ResourceFetchResponse<HistoryListData>>;
}

/**
 * Gets the list of edit histories for a specific resource with the given ID.
 *
 * @param resource The resource to get
 * @param id The ID to get the history of
 */
export async function getHistory(resource: string, id: string): Promise<ResourceFetchResponse<HistoryItemData>> {
    return getRequest(`/history/${resource}/${id}`) as Promise<ResourceFetchResponse<HistoryItemData>>;
}

/* #################### TEXT DATA API #################### */

/**
 * Gets a list of external links
 */
export async function getExternalLinks(): Promise<ListFetchResponse<ExternalLink>> {
    return getRequest('/text-data/external-links') as Promise<ListFetchResponse<ExternalLink>>;
}

/**
 * Updates an the list of external links
 *
 * @param textData TextData object with list of external links
 */
export async function putExternalLinks(textData: TextData<ExternalLink[]>): Promise<StatusResponse> {
    return putRequest('/text-data/external-links', JSON.stringify(textData));
}

/* #################### FEEDBACK API #################### */

/**
 * Gets the list of all feedback
 */
export async function getFeedback(): Promise<ListFetchResponse<Feedback>> {
    return getRequest('/feedback') as Promise<ListFetchResponse<Feedback>>;
}

/**
 * Submits a new feedback object.
 *
 * @param feedback Feedback object
 */
export async function postFeedback(feedback: Feedback): Promise<StatusResponse> {
    return postRequest('/feedback', JSON.stringify(feedback), true, false);
}

/* #################### AUTH AND USER API #################### */

/**
 * Performs a token exchange/login request after the Google auth flow returns tokens
 * @param googleId Google ID
 * @param accessCode Google Auth access code
 */
export async function postLogin(tokenId: string): Promise<FetchResponse> {
    return postRequest('/auth/login', JSON.stringify({ tokenId }), true, true, true) as Promise<FetchResponse>;
}

/**
 * Gets the information of a logged in user, will return a 401 error
 * if the user is not logged in.
 *
 * @param token User auth token
 */
export async function getUserInfo(token: string): Promise<ResourceFetchResponse<User>> {
    return getRequest(`/users/${token}`) as Promise<ResourceFetchResponse<User>>;
}

/**
 * Gets the name of the user with the provided ID. This will only be used
 * on the history list page.
 *
 * @param id User ID
 */
export async function getUserById(id: string): Promise<ResourceFetchResponse<User>> {
    return getRequest(`/users/id/${id}`) as Promise<ResourceFetchResponse<User>>;
}

/**
 * Updates the level of a single user with the provided ID
 * @param id User ID
 * @param level New level of the user
 */
export async function putUserLevel(id: string, level: AccessLevel): Promise<StatusResponse> {
    return putRequest(`/users/level/${id}`, JSON.stringify({ level }));
}

/**
 * Gets a list of users based on search terms
 * @param page Page number to get
 * @param limit Number of items per page
 * @param sort Sorting method used
 * @param reverse True if reverse sort
 * @param filter Filter object
 */
export async function getUserList(
    page: number = 1,
    limit: number = 10,
    sort: string = '',
    reverse: boolean = false,
    filter: GridFilterItem
): Promise<ResourceFetchResponse<AdminResourceList>> {
    const aFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    return getRequest(`/users?page=${page}&limit=${limit}&sort=${sort}&reverse=${reverse}${aFilter}`) as Promise<
        ResourceFetchResponse<AdminResourceList>
    >;
}

/** #################### ADMIN API #################### */

/**
 * Gets a list of resources based on search terms
 * @param resource Resource type to get
 * @param page Page number to get
 * @param limit Number of items per page
 * @param sort Sorting method used
 * @param reverse True if reverse sort
 * @param filter Filter object
 */
export async function getAdminResources(
    resource: Resource,
    page: number = 1,
    limit: number = 10,
    sort: string = '',
    reverse: boolean = false,
    filter: GridFilterItem
): Promise<ResourceFetchResponse<AdminResourceList>> {
    const aFilter = filter ? `&filter=${JSON.stringify(filter)}` : '';
    return getRequest(
        `/admin/resources/${resource}?page=${page}&limit=${limit}&sort=${sort}&reverse=${reverse}${aFilter}`
    ) as Promise<ResourceFetchResponse<AdminResourceList>>;
}

/**
 * Deletes a resource given its resource name and id
 * @param resource Resource to delete
 * @param id ID of the resource to delete
 */
export async function deleteAdminResource(resource: string, id: string): Promise<StatusResponse> {
    return deleteRequest(`/admin/resources/${resource}/${id}`);
}

/** #################### URL APIS #################### */

export function getBackendUrl(): string {
    return BACKEND_URL;
}

export function getCdnUrl(): string {
    return CDN_URL;
}
