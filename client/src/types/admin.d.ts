/** Used for getting resources on the admin dashboard */
interface AdminResource {
    /** Name of the resource */
    name: string;

    /** ID of the resource */
    id: string;
}

/** List of resources returned by mongoose-paginate-v2 from the backend */
interface AdminResourceList {
    docs: (CalEvent | Club | Volunteering | User)[];
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
