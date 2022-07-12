import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface TitleMetaProps {
    /** Title of the list */
    title?: string;

    /** Full path of the page, including the '/' */
    path?: string;
}

/**
 * Meta tags for pages that only have a title and url, for all pages that
 * are not resource displays: [resource lists and utility pages]
 */
const TitleMeta = (props: TitleMetaProps) => {
    const [prod, setProd] = useState(true);

    useEffect(() => {
        setProd(window.location.origin === 'https://tams.club');
    }, []);

    const title =
        (prod ? '' : '[Staging] ') + (props.title ? `${props.title} - TAMS Club Calendar` : 'TAMS Club Calendar');

    return (
        <Head>
            <title>{title}</title>
            <meta key="title" property="og:title" content={title} />
            <meta key="title-1" name="twitter:title" content={title} />
            {props.path ? <meta key="url" property="og:url" content={`https://tams.club${props.path}`} /> : null}
            {prod ? null : <meta key="robots" name="robots" content="noindex" />}
        </Head>
    );
};

export default TitleMeta;
