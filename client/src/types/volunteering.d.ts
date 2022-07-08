/** An object containing the information for a volunteering opportunity */
interface Volunteering {
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
