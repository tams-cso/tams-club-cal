import React from 'react';
import { Helmet } from 'react-helmet';
import { capitalize } from '@mui/material';

/**
 * Sets the title for the page
 * @param {object} props React props object
 * @param {string} props.name Name of the resource
 * @param {"events" | "clubs" | "volunteering" | "reservations"} props.resource Resource of the page
 * @param {boolean} [props.editHistory] If true, will show edit history before title
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
