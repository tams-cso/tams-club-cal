import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';

const useStyles = makeStyles({
    root: {
        paddingTop: 16,
        paddingBottom: props => props.noBottom ? 0 : 16,
        display: 'flex',
        height: 'calc(100vh - 64px)',
    },
});

/**
 * Wraps all pages with a simple styling and scroll to top
 * 
 * @param {object} props React props object
 * @param {boolean} [noBottom] If true will not have a bottom padding
 */
const PageWrapper = (props) => {
    const classes = useStyles({ noBottom: props.noBottom });
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return <div className={`${classes.root} ${props.className || ''}`}>{props.children}</div>;
};

export default PageWrapper;
