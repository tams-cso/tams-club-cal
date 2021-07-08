import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    root: {
        paddingTop: '1rem',
        display: 'flex',
    },
});

const PageWrapper = (props) => {
    const classes = useStyles();
    return <div className={`${classes.root} ${props.className || ''}`}>{props.children}</div>;
};

export default PageWrapper;
