import React, { useEffect, useState } from 'react';
import { capitalize } from '@mui/material';
import Head from 'next/head';
import { getCdnUrl } from '../../api';

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
    const [prod, setProd] = useState(false);

    useEffect(() => {
        setProd(window.location.origin === 'https://tams.club');
    }, []);

    const title =
        (prod ? '' : '[Staging] ') +
        (props.editHistory ? '[Edit History] ' : '') +
        `${props.name} | ${capitalize(props.resource)} - TAMS Club Calendar`;

    const url = props.imgSrc ? `${getCdnUrl()}/${props.imgSrc}` : null;
    const image = props.imgSrc
        ? [
              <meta key="image-0" property="og:image" content={url} />,
              <meta key="image-1" property="og:image:width" content="1800" />,
              <meta key="image-2" property="og:image:height" content="750" />,
              <meta key="image-3" name="twitter:image" content={url} />,
          ]
        : null;

    return (
        <Head>
            <title>{title}</title>
            <meta key="description" name="description" content={props.description} />
            <meta key="title" property="og:title" content={title} />
            <meta key="url" property="og:url" content={`https://tams.club${props.path}`} />
            {image}
            <meta key="title-1" name="twitter:title" content={title} />
            <meta key="description-1" name="twitter:description" content={props.description} />
            {prod ? null : <meta key="robots" name="robots" content="noindex" />}
        </Head>
    );
};

export default ResourceMeta;
