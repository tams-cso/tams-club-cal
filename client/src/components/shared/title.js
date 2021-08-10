import React from 'react';
import { Helmet } from 'react-helmet';
import { capitalize } from '@material-ui/core';

/**
 * The metadata for a list of resources
 * @param {object} props React props object
 * @param {boolean} [props.editHistory] If true, will show edit history before title
 * @param {"events" | "clubs" | "volunteering" | "reservations"} props.resource Resource of the page
 * @param {string} props.name Name of the resource
 * @param {string} props.title Title of the page; if defined will ignore name/resource/editHistory fields
 */
const Title = (props) => {
    const alt = (props.editHistoy ? '[Edit History]' : '') + `${props.name} | ${capitalize(props.resource || '')}`;
    const title = (props.title || alt) + ' - TAMS Club Calendar';

    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default Title;
