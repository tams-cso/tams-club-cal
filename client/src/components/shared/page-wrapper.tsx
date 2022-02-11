import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { darkSwitch } from '../../util';

import Head from 'next/head';
import Box from '@mui/material/Box';
import Popup from './popup';
import TitleMeta from '../meta/title-meta';

interface PageWrapperProps extends React.HTMLProps<HTMLDivElement> {
    /** If true, page will not have a bottom padding */
    noBottom?: boolean;

    /** Will change the title to the given title */
    title?: string;

    /** Format the root Box */
    sx?: object;
}

/**
 * Wraps all pages with a simple styling and scroll to top,
 * as well as modify the Head meta tags.
 */
const PageWrapper = (props: PageWrapperProps) => {
    const router = useRouter();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [router.pathname]);

    return (
        <Box
            sx={{
                paddingTop: 2,
                paddingBottom: props.noBottom ? 0 : 2,
                display: 'flex',
                height: (theme) => darkSwitch(theme, 'calc(100vh - 73px)', 'calc(100vh - 64px)'),
                ...props.sx,
            }}
        >
            <Popup cookieCheck />
            {props.title ? (
                <TitleMeta title={props.title} />
            ) : null}
            {props.children}
        </Box>
    );
};

export default PageWrapper;
