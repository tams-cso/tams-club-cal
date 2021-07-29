import React from 'react';
import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ActionBar from '../action-bar';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

const Calendar = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <ActionBar active="calendar" />
            <Box className={classes.root}>CALENDAR VIEW</Box>
        </React.Fragment>
    );
};

export default Calendar;
