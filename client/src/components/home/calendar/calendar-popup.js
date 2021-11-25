import React from 'react';
import dayjs from 'dayjs';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import CalendarEvent from './calendar-event';

/**
 * Popup that displays when the user clicks on a day in the calendar.
 * This will show a list of all events that are happening on that day.
 * 
 * @param {object} props React props object
 * @param {Event[]} props.events List of all events for the current day
 * @param {dayjs.Dayjs} props.date Date to display
 * @param {boolean} props.open State variable to check if dialog open
 * @param {Function} props.close Function to run when closing dialog
 */
const CalendarPopup = (props) => {
    return (
        <Dialog aria-labelledby="calendar-popup-title" open={props.open} onClose={props.close} fullWidth>
            <DialogTitle id="calendar-popup-title">{`Events for ${props.date.format('MMM DD, YYYY')}`}</DialogTitle>
            <List>
                {props.events.map((e) => (
                    <CalendarEvent event={e} key={e.id} lighter />
                ))}
            </List>
        </Dialog>
    );
};

export default CalendarPopup;
