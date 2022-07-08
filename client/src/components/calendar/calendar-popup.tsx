import React from 'react';
import type { Dayjs } from 'dayjs';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import CalendarEvent from './calendar-event';

interface CalendarPopupProps {
    /** List of all events for the current day */
    activities: CalEvent[];

    /** Date to display */
    date: Dayjs;

    /** State variable to check if the dialog is open */
    open: boolean;

    /** State function to close the dialog */
    close: Function;
}

/**
 * Popup that displays when the user clicks on a day in the calendar.
 * This will show a list of all events that are happening on that day.
 */
const CalendarPopup = (props: CalendarPopupProps) => {
    return (
        <Dialog
            aria-labelledby="calendar-popup-title"
            open={props.open}
            onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                props.close();
                e.stopPropagation();
            }}
            fullWidth
        >
            <DialogTitle id="calendar-popup-title">{`Events for ${props.date.format('MMM DD, YYYY')}`}</DialogTitle>
            <List sx={{ paddingBottom: '1rem' }}>
                {props.activities.map((e) => (
                    <CalendarEvent event={e} key={e.id} />
                ))}
            </List>
        </Dialog>
    );
};

export default CalendarPopup;
