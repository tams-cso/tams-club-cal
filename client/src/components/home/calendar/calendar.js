import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { openPopup } from '../../../redux/actions';
import { darkSwitch, parseEventList } from '../../../functions/util';
import { getEventListInRange } from '../../../functions/api';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CalendarDay from './calendar-day';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';

// Template rows for each number of possible calendar rows
const rowStyles = {
    4: { gridTemplateRows: 'repeat(4, minmax(0, 1fr))' },
    5: { gridTemplateRows: 'repeat(5, minmax(0, 1fr))' },
    6: { gridTemplateRows: 'repeat(6, minmax(0, 1fr))' },
};

/**
 * The main Calendar page that fetches the data
 * and splits up the events into days, creating lists of CalendarDay components
 * to display to the user in a grid with a calculated number of rows.
 */
const Calendar = () => {
    const [offset, setOffset] = useState(0);
    const [calendarDays, setCalendarDays] = useState(null);
    const [month, setMonth] = useState(null);
    const [rows, setRows] = useState(0);
    const dispatch = useDispatch();

    // Hook that will fetch the calendar data
    // First the number of days and the first date is calculated
    // Then we fetch the events for the month
    // These events are then grouped by date and each calendar day is created
    useEffect(async () => {
        // Get the current month, given the month offset
        const now = dayjs().add(offset, 'month');
        
        // Calculate the number of days in the month
        const daysInMonth = now.daysInMonth();

        // Calculate the first day of the month
        const firstDayOfWeek = now.set('date', 1).day();
        const firstDateInMonth =
            firstDayOfWeek === 0 ? now.set('date', 1) : now.set('date', 1).subtract(firstDayOfWeek, 'day');
        
        // See how many extra days are needed to fill in the last row
        const extraDays = (daysInMonth + firstDayOfWeek) % 7;
        
        // Calculate the total days in a month
        const totalDays = daysInMonth + firstDayOfWeek + (extraDays !== 0 ? 7 - extraDays : 0);
        
        // Calculate the number of rows needed for the calendar
        // THIS SHOULD ALWAYS BE A WHOLE NUMER!!
        const numRows = totalDays / 7; 

        // Calculate the start/end dates to fetch events for
        const startOfPrevMonth = now.subtract(1, 'month').date(1);
        const nextMonth = now.add(1, 'month');
        const endOfNextMonth = nextMonth.date(nextMonth.daysInMonth());

        // Retrieve the events based on the set dates
        // If there is an error, show an error popup and don't continue
        let res = await getEventListInRange(startOfPrevMonth.valueOf(), endOfNextMonth.valueOf());
        if (res.status !== 200) {
            dispatch(openPopup('Could not load calendar events. Please check your internet and refresh the page.', 4));
            return;
        }

        // Parse the fetched events by splitting multi-day events into separate event objects
        const events = parseEventList(res.data);

        // Create the actual list of calendar days by grouping
        // events into their days and adding it to the components list
        let dayComponents = [];
        for (let i = 0; i < totalDays; i++) {
            // Get the current day by adding i number of days to the first in the month
            const currDay = firstDateInMonth.add(i, 'day');
            
            // Filter out the events for the current day from the events list
            const currentDayEvents = events.filter((e) => dayjs(e.start).isSame(currDay, 'day'));

            // If the CalendarDay is the current date or this month, style it differently
            const isToday = dayjs().isSame(currDay, 'day');
            const thisMonth = now.isSame(currDay, 'month');

            // Add a CalendarDay to the list of components
            dayComponents.push(
                <CalendarDay
                    events={currentDayEvents}
                    date={currDay}
                    key={i}
                    noRight={i % 7 === 6}
                    otherMonth={!thisMonth}
                    isToday={isToday}
                    rows={numRows}
                />
            );
        }

        // Save components to state variables to display
        setCalendarDays(dayComponents);
        setRows(numRows);
        setMonth(now.format('MMMM YYYY'));
    }, [offset]);

    // Adjust the offset of month when user clicks on the arrow buttons
    // The change that is passed in will be +1 or -1 depending on which arrow button was clicked
    const changeOffset = (change = 0) => setOffset(change === 0 ? 0 : offset + change);

    // Create the days of the week as the header
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarHeaderList = days.map((date) => (
        <Typography
            key={date}
            sx={{
                flexGrow: 1,
                textAlign: 'center',
                fontWeight: 300,
            }}
        >
            {date}
        </Typography>
    ));

    return (
        <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
            <AddButton color="primary" label="Event" path="/edit/events" />
            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                <IconButton size="small" onClick={changeOffset.bind(this, -1)}>
                    <ArrowBackIosRoundedIcon />
                </IconButton>
                <Typography variant="h1" component="h2" sx={{ width: 250, textAlign: 'center' }}>
                    {month}
                </Typography>
                <IconButton size="small" onClick={changeOffset.bind(this, 1)}>
                    <ArrowForwardIosRoundedIcon />
                </IconButton>
            </Box>
            <Box width="100%" display="flex" marginTop={1}>
                {calendarHeaderList}
            </Box>
            {calendarDays === null ? (
                <Loading />
            ) : (
                <Box
                    sx={{
                        borderTop: 'solid 1px',
                        borderTopColor: (theme) => darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700]),
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                        flexGrow: 1,
                        ...rowStyles[rows],
                    }}
                >
                    {calendarDays}
                </Box>
            )}
        </Box>
    );
};

export default Calendar;
