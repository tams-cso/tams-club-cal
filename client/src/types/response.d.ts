/** Return object for fetch requests */
interface FetchResponse {
    /** The HTTP status code */
    status: number;

    /** Data of the request */
    data: object | null;
}

/** Return object for fetch requests that only have a status */
type StatusResponse = {
    /** The HTTP status code */
    status: number;
};
