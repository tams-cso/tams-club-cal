import React from 'react';
import Head from 'next/head';

interface TitleMetaProps {
    /** Title of the list */
    title: string;

    /** Full path of the page, including the '/' */
    path?: string;
}

/**
 * Meta tags for pages that only have a title and url, for all pages that
 * are not resource displays: [resource lists and utility pages]
 */
const TitleMeta = (props: TitleMetaProps) => {
    return (
        <Head>
            <title>{props.title} - TAMS Club Calendar</title>
            <meta key="title" property="og:title" content={`${props.title} - TAMS Club Calendar`} />
            <meta key="title-1" name="twitter:title" content={`${props.title} - TAMS Club Calendar`} />
            {props.path ? <meta key="url" property="og:url" content={`https://tams.club${props.path}`} /> : null}
        </Head>
    );
};

export default TitleMeta;
