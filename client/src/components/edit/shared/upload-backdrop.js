import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

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
