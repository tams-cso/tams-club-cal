import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * The metadata for a list of resources
 * @param {object} props React props object
 * @param {string} props.title Title of the page
 * @param {string} props.path Full pathname of the page, including the "/"
 */
const ListMeta = (props) => {
    return (
        <Helmet>
            <title>{props.title} - TAMS Club Calendar</title>
            <meta property="og:title" content={`${props.title} - TAMS Club Calendar`} />
            <meta name="twitter:title" content={`${props.title} - TAMS Club Calendar`} />
            <meta property="og:url" content={`https://tams.club${props.path}`} />
        </Helmet>
    );
};

export default ListMeta;
