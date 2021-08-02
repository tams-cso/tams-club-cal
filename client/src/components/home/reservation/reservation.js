import React from 'react';
import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
    },
}));

const Reservation = () => {
    const classes = useStyles();
    return <Box className={classes.root}>Reservation Calendar WIP...</Box>;
};

export default Reservation;
