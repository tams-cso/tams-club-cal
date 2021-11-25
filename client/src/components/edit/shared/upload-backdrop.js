import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

/**
 * Displays a backdrop above all content to make said content uninteractable.
 * This is used when the user is uploading some set of edits.
 *
 * @param {object} props React props object
 * @param {boolean} props.open True if the backdrop is open
 */
const UploadBackdrop = (props) => {
    return (
        <Backdrop
            open={props.open}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 10,
                color: '#fff',
            }}
        >
            <Typography variant="h1" sx={{ marginRight: 2 }}>
                Uploading...
            </Typography>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default UploadBackdrop;
