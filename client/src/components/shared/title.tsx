import React from 'react';
import { Helmet } from 'react-helmet';
import { capitalize } from '@mui/material';
import { Resource } from '../../types';

interface TitleProps {
    /** Name of the resource */
    name?: string;

    /** Resource of the page */
    resource?: Resource;

    /** If true, will show "Edit History" before the title */
    editHistory?: boolean;

    /** Hardcoded title of the page; if defined, will ignore the other fields */
    title?: string;
}

/**
 * Sets the title for the page
 */
const Title = (props: TitleProps) => {
    const alt = (props.editHistory ? '[Edit History] ' : '') + `${props.name} | ${capitalize(props.resource || '')}`;
    const title = (props.title || alt) + ' - TAMS Club Calendar';

    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default Title;
