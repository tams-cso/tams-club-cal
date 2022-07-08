import React, { useEffect, useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { createPopupEvent } from '../../util/constructors';
import { getCookie, removeCookie } from '../../util/cookies';

interface PopupProps {
    /** Event to display */
    event?: PopupEvent | null;

    /** If true, will check cookies to show success message */
    cookieCheck?: boolean;
}

/**
 * Displays a popup whenever event is updated. For this to happen,
 * props.event.time must be set to the current time.
 */
const Popup = ({ event, cookieCheck }: PopupProps) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<PopupEvent>({ severity: 0, message: '', time: 0 });

    const handleClose = () => {
        setOpen(false);
    };

    const calcSeverity = () => {
        const severityMap = {
            1: 'info',
            2: 'success',
            3: 'warning',
            4: 'error',
        };
        return severityMap[data.severity] || 'error';
    };

    const getSuccessMessage = (success: string) => {
        const split = success.split('-');
        if (split.length !== 2) return success;
        return `Successfully ${split[0] === 'add' ? 'added' : 'updated'} ${split[1]}!`;
    };

    // Update data when new event is passed in
    useEffect(() => {
        if (event) setData(event);
    }, [event]);

    // Open the popup if the success cookie was set
    // Only do this on mount
    useEffect(() => {
        if (!cookieCheck) return;
        const success = getCookie('success');
        if (success) {
            removeCookie('success');
            setData(createPopupEvent(getSuccessMessage(success), 2));
            setOpen(true);
        }
    }, []);

    // Open the popup if event changed
    useEffect(() => {
        if (!event) return;
        setOpen(true);
    }, [event]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            {data.severity !== 0 ? (
                <Alert severity={calcSeverity()}>{data.message}</Alert>
            ) : (
                <Card sx={{ padding: 1.5 }}>
                    <Typography>{data.message}</Typography>
                </Card>
            )}
        </Snackbar>
    );
};
export default Popup;
