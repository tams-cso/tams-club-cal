import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { darkSwitch, darkSwitchGrey } from '../../util';
import type { Event } from '../../types';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalendarEvent from './calendar-event';
import CalendarPopup from './calendar-popup';

interface CalendarDayPopup {
    /** List of all events for the current day */
    activities: Event[];

    /** Date to display */
    date: Dayjs;

    /** Number of rows in the current month */
    rows: number;

    /** If true, will not show the right border */
    noRight?: boolean;

    /** If true, will color the box green */
    isToday?: boolean;

    /** If true, will color the box grey */
    otherMonth?: boolean;
}

/**
 * Represents a single grid cell in the calendar view.
 * The CalendarDay will render a list of events for the day
 * up to a certain limit, and will render a button that the
 * user can click to see more events.
 */
const CalendarDay = (props: CalendarDayPopup) => {
    const [popupOpen, setPopupOpen] = useState(false);

    // Switches the popup state to open if clicked
    const togglePopup = (open: boolean) => setPopupOpen(open);

    // Calculates how many extra events there are that can't fit
    // and slices the array accordingly
    const maxActivities = props.rows === 5 ? 3 : 4;
    const extraActivities = Math.max(props.activities.length - maxActivities, 0);
    const activities = extraActivities > 0 ? props.activities.slice(0, maxActivities) : props.activities;

    return (
        <Box
            sx={{
                borderBottom: (theme) =>
                    `1px solid ${darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])}`,
                borderRight: (theme) =>
                    props.noRight
                        ? 'none'
                        : `1px solid ${darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])}`,
            }}
        >
            <Button
                onClick={togglePopup.bind(this, true)}
                sx={{
                    margin: 0.5,
                    padding: 0.5,
                    minWidth: 28,
                    height: 28,
                    fontSize: '1rem',
                    color: (theme) =>
                        props.isToday
                            ? theme.palette.primary.main
                            : props.otherMonth
                            ? darkSwitch(theme, theme.palette.grey[400], theme.palette.grey[700])
                            : 'inherit',
                }}
            >
                {props.date.date()}
            </Button>
            <List sx={{ paddingTop: 0 }}>
                {activities.map((a) => (
                    <CalendarEvent activity={a} key={a.id} />
                ))}
                {extraActivities === 0 ? null : (
                    <ListItem sx={{ padding: 0 }}>
                        <Typography
                            sx={{
                                width: '100%',
                                fontSize: { lg: '0.8rem', xs: '0.5rem' },
                                textAlign: 'center',
                                color: (theme) => darkSwitchGrey(theme),
                            }}
                        >
                            {`+${extraActivities} more event(s)`}
                        </Typography>
                    </ListItem>
                )}
            </List>
            <CalendarPopup
                activities={props.activities}
                date={props.date}
                open={popupOpen}
                close={togglePopup.bind(this, false)}
            />
        </Box>
    );
};

export default CalendarDay;
