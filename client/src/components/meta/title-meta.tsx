import React from 'react';
import { Helmet } from 'react-helmet';

interface TitleMetaProps {
    /** Title of the list */
    title: string;

    /** Full path of the page, including the '/' */
    path: string;
}

/**
 * Meta tags for pages that only have a title and url, for all pages that
 * are not resource displays: [resource lists and utility pages]
 */
const TitleMeta = (props: TitleMetaProps) => {
    return (
        <Helmet>
            <title>{props.title} - TAMS Club Calendar</title>
            <meta property="og:title" content={`${props.title} - TAMS Club Calendar`} />
            <meta name="twitter:title" content={`${props.title} - TAMS Club Calendar`} />
            <meta property="og:url" content={`https://tams.club${props.path}`} />
        </Helmet>
    );
};

export default TitleMeta;
