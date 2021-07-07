import React from 'react';
import { makeStyles } from '@material-ui/core';

import HomeDrawer from '../home/home-drawer';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        paddingTop: '1rem',
    },
});

const Event = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <HomeDrawer></HomeDrawer>
        </div>
    );
};

export default Event;
