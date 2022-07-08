/** Wrapper interface for any text data, such as external-links. This will mostly be from the admin dashboard */
interface TextData<T> {
    /** Type value of the text data (eg. external-links) */
    type: string;

    /** Data to store */
    data: T;
}

/** List of external links for the site */
interface ExternalLink {
    /** Display name of the external link */
    name: string;

    /** URL it links to */
    url: string;

    /** ID of the icon to display; see https://fonts.google.com/icons?icon.style=Rounded */
    icon: string;
}
