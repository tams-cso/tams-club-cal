import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles({
    root: {
        paddingTop: 16,
        paddingBottom: (props) => (props.noBottom ? 0 : 16),
        display: 'flex',
        height: 'calc(100vh - 64px)',
    },
});

/**
 * Wraps all pages with a simple styling and scroll to top
 *
 * @param {object} props React props object
 * @param {boolean} [props.noBottom] If true will not have a bottom padding
 * @param {string} props.title Will change the title to the given title
 */
const PageWrapper = (props) => {
    const classes = useStyles({ noBottom: props.noBottom });
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className={`${classes.root} ${props.className || ''}`}>
            {props.title ? (
                <Helmet>
                    <title>{`${props.title} - TAMS Club Calendar`}</title>
                </Helmet>
            ) : null}
            {props.children}
        </div>
    );
};

export default PageWrapper;
