import { capitalize } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getCdnUrl } from '../../api';
import { Resource } from '../../types';

interface ResourceMetaProps {
    /** If true, will show [Edit History] before title */
    editHistory?: boolean;

    /** Type of resource shown */
    resource: Resource;

    /** Name of the resource */
    name: string;

    /** Full pathname of the page, including the '/' */
    path: string;

    /** Description of the resource */
    description: string;

    /** URL of the image to show */
    imgSrc?: string;
}

/**
 * Creates meta tags for pages that display a single resource object
 */
const ResourceMeta = (props: ResourceMetaProps) => {
    const title =
        (props.editHistory ? '[Edit History] ' : '') +
        `${props.name} | ${capitalize(props.resource)} - TAMS Club Calendar`;
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!props.imgSrc) return null;
        const url = props.imgSrc ? `${getCdnUrl()}/${props.imgSrc}` : `${getCdnUrl()}/default-cover.webp`;
        setImage([
            <meta key={0} property="og:image" content={url} />,
            <meta key={1} property="og:image:width" content="1800" />,
            <meta key={2} property="og:image:height" content="750" />,
            <meta key={3} name="twitter:image" content={url} />,
        ]);
    }, [props.imgSrc]);

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

export default ResourceMeta;
