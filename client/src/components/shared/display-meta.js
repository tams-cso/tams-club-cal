import { capitalize } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getCdnUrl } from '../../functions/api';

/**
 * The metadata for a list of resources
 * @param {object} props React props object
 * @param {boolean} [props.editHistory] If true, will show edit history before title
 * @param {"events" | "clubs" | "volunteering" | "reservations"} props.resource Resource of the page
 * @param {string} props.name Name of the resource
 * @param {string} props.path Full pathname of the page, including the "/"
 * @param {string} props.description Description of the resource
 * @param {string} [props.image] URL of image
 */
const DisplayMeta = (props) => {
    const title =
        (props.editHistoy ? '[Edit History] ' : '') +
        `${props.name} | ${capitalize(props.resource)} - TAMS Club Calendar`;
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!props.image) return null;
        setImage([
            <meta key={0} property="og:image" content={`${getCdnUrl()}/${props.image}`} />,
            <meta key={1} property="og:image:width" content="1800" />,
            <meta key={2} property="og:image:height" content="750" />,
            <meta key={3} name="twitter:image" content={`${getCdnUrl()}/${props.image}`} />,
        ]);
    }, [props.image]);

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={props.description} />
            <meta property="og:title" content={title} />
            <meta property="og:url" content={`https://tams.club${props.path}`} />
            {image}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={props.description} />
        </Helmet>
    );
};

export default DisplayMeta;
