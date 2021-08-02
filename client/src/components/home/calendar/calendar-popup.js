import React from 'react';
import dayjs from 'dayjs';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import CalendarEvent from './calendar-event';

/**
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
