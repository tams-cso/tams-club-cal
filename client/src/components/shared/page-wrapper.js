import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { darkSwitch } from '../../functions/util';

import Box from '@mui/material/Box';

/**
 * Wraps all pages with a simple styling and scroll to top
 *
 * @param {object} props React props object
 * @param {boolean} [props.noBottom] If true will not have a bottom padding
 * @param {string} props.title Will change the title to the given title
 * @param {object} props.sx Format the root element
 */
const PageWrapper = (props) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Box
            sx={{
                paddingTop: 2,
                paddingBottom: (props) => (props.noBottom ? 0 : 2),
                display: 'flex',
                height: (theme) => darkSwitch(theme, 'calc(100vh - 72px)', 'calc(100vh - 64px)'),
                ...props.sx,
            }}
        >
            {props.title ? (
                <Helmet>
                    <title>{`${props.title} - TAMS Club Calendar`}</title>
                </Helmet>
            ) : null}
            {props.children}
        </Box>
    );
};

export default PageWrapper;
