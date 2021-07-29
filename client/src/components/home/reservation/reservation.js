import React from 'react';
import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ActionBar from '../action-bar';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
    },
}));

const Reservation = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <ActionBar active="reservation" />
            <Box className={classes.root}>Reservation Calendar WIP...</Box>
        </React.Fragment>
    );
};

export default Reservation;
