import React from 'react';
import { makeStyles } from '@material-ui/core';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    uploading: {
        marginRight: 12,
    },
}));

/**
 * Displays a backdrop above all content to make said content uninteractable
 *
 * @param {object} props React props object
 * @param {boolean} props.open True if the backdrop is open
 */
const UploadBackdrop = (props) => {
    const classes = useStyles();
    return (
        <Backdrop open={props.open} className={classes.root}>
            <Typography variant="h1" className={classes.uploading}>
                Uploading...
            </Typography>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default UploadBackdrop;
