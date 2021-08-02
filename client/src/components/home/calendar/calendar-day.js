import React, { useState } from 'react';
import dayjs from 'dayjs';
import { darkSwitch, darkSwitchGrey } from '../../../functions/util';
import { Event } from '../../../functions/entries';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import CalendarEvent from './calendar-event';
import CalendarPopup from './calendar-popup';

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: `1px solid ${darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])}`,
        borderRight: (props) =>
            props.noRight ? 'none' : `1px solid ${darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])}`,
    },
    date: {
        margin: 4,
        padding: 4,
        minWidth: 28,
        height: 28,
        fontSize: '1rem',
        color: (props) =>
            props.isToday
                ? theme.palette.primary.main
                : props.otherMonth
                ? darkSwitch(theme, theme.palette.grey[400], theme.palette.grey[700])
                : 'inherit',
    },
    list: {
        paddingTop: 0,
    },
    moreEvents: {
        padding: 0,
    },
    moreEventsText: {
        width: '100%',
        fontSize: '0.8rem',
        textAlign: 'center',
        color: darkSwitchGrey(theme),
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.5rem',
        },
    },
}));

/**
 * Represents a single grid cell in the calendar view
 *
 * @param {object} props React props object
 * @param {Event[]} props.events List of all events for the current day
 * @param {dayjs.Dayjs} props.date Date to display
 * @param {number} props.rows Number of rows in the current month
 * @param {boolean} [props.noRight] If true will not show right border
 * @param {boolean} [props.isToday] If true will color the box green!
 * @param {boolean} [props.otherMonth] If true will color the box grey
 */
const CalendarDay = (props) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const classes = useStyles({ noRight: props.noRight, isToday: props.isToday, otherMonth: props.otherMonth });

    const togglePopup = (open = true) => setPopupOpen(open);

    // Calculates how many extra events there are that can't fit
    // and slices the array accordingly
    const maxEvents = props.rows === 5 ? 3 : 4;
    const extraEvents = Math.max(props.events.length - maxEvents, 0);
    const events = extraEvents > 0 ? props.events.slice(0, maxEvents) : props.events;
    return (
        <Box className={classes.root}>
            <Button className={classes.date} onClick={togglePopup}>
                {props.date.date()}
            </Button>
            <List className={classes.list}>
                {events.map((e) => (
                    <CalendarEvent event={e} key={e.id} />
                ))}
                {extraEvents === 0 ? null : (
                    <ListItem className={classes.moreEvents}>
                        <Typography className={classes.moreEventsText}>{`+${extraEvents} more event(s)`}</Typography>
                    </ListItem>
                )}
            </List>
            <CalendarPopup events={props.events} date={props.date} open={popupOpen} close={togglePopup.bind(this, false)} />
        </Box>
    );
};

export default CalendarDay;
