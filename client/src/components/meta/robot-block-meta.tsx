import React from 'react';
import Head from 'next/head';

/**
 * Robot blocking meta tag that tells search engines to not display this page in search results.
 * Used for the admin, auth, and any other pages that search engines should not see.
 * This is also useful for hiding errored pages from search engines!
 */
const RobotBlockMeta = () => {
    return (
        <Head>
            <meta key="robots" name="robots" content="noindex" />
        </Head>
    );
};

export default RobotBlockMeta;
