import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useLocation } from 'react-router';

const useStyles = makeStyles({
    root: {
        paddingTop: '1rem',
        display: 'flex',
    },
});

const PageWrapper = (props) => {
    const classes = useStyles();
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return <div className={`${classes.root} ${props.className || ''}`}>{props.children}</div>;
};

export default PageWrapper;
