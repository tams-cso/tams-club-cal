import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Robot blocking meta tag that tells search engines to not display this page in search results.
 * Used for the admin, auth, and any other pages that search engines should not see.
 * This is also useful for hiding errored pages from search engines!
 */
const RobotBlockMeta = () => {
    return (
        <Helmet>
            <meta name="robots" content="noindex" />
        </Helmet>
    );
};

export default RobotBlockMeta;
