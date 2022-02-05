import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface UploadBackdropProps {
    /** True if the backdrop is open */
    open: boolean;

    /** Custom text to put on the backdrop */
    text?: string;
}

/**
 * Displays a backdrop above all content to make said content uninteractable.
 * This is used when the user is uploading some set of edits.
 */
const UploadBackdrop = (props: UploadBackdropProps) => {
    return (
        <Backdrop
            open={props.open}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 10,
                color: '#fff',
            }}
        >
            <Typography variant="h1" sx={{ marginRight: 2 }}>
                {props.text ? props.text : 'Uploading...'}
            </Typography>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default UploadBackdrop;
