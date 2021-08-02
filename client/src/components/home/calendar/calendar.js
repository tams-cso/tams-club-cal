import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { openPopup } from '../../../redux/actions';
import { darkSwitch } from '../../../functions/util';
import { getEventListInRange } from '../../../functions/api';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import CalendarDay from './calendar-day';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';

const useStyles = makeStyles((theme) => ({
    root: {
        borderTop: 'solid 1px',
        borderTopColor: darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700]),
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        flexGrow: 1,
    },
    row4: {
        gridTemplateRows: 'repeat(4, minmax(0, 1fr))',
    },
    row5: {
        gridTemplateRows: 'repeat(5, minmax(0, 1fr))',
    },
    row6: {
        gridTemplateRows: 'repeat(6, minmax(0, 1fr))',
    },
    wrapper: {
        minHeight: '100%',
    },
    header: {
        flexGrow: 1,
        textAlign: 'center',
        fontWeight: 300,
    },
    month: {
        width: 250,
        textAlign: 'center',
    },
}));

const Calendar = () => {
    const [offset, setOffset] = useState(0);
    const [calendarDays, setCalendarDays] = useState(null);
    const [month, setMonth] = useState(null);
    const [rows, setRows] = useState(0);
    const dispatch = useDispatch();
    const classes = useStyles({ rows });

    const changeOffset = (change = 0) => setOffset(change === 0 ? 0 : offset + change);

    useEffect(async () => {
        // Get number of days to display and the first date
        // in the month grid. The first row must include the 1st
        // day of the month. The rest of the rows will fill in
        // with the month dates and the last row must include
        // the last day of the current month.
        const now = dayjs().add(offset, 'month');
        const daysInMonth = now.daysInMonth();
        const firstDayOfWeek = now.set('date', 1).day();
        const firstDateInMonth =
            firstDayOfWeek === 0 ? now.set('date', 1) : now.set('date', 1).subtract(firstDayOfWeek, 'day');
        const extraDays = (daysInMonth + firstDayOfWeek) % 7;
        const totalDays = daysInMonth + firstDayOfWeek + (extraDays !== 0 ? 7 - extraDays : 0);
        const numRows = totalDays / 7; // SHOULD ALWAYS BE A WHOLE NUMER!!

        // Retrieve the events based on the set dates
        const startOfPrevMonth = now.subtract(1, 'month').date(1);
        const nextMonth = now.add(1, 'month');
        const endOfNextMonth = nextMonth.date(nextMonth.daysInMonth());
        let res = await getEventListInRange(startOfPrevMonth.valueOf(), endOfNextMonth.valueOf());
        if (res.status !== 200) {
            dispatch(openPopup('Could not load calendar events. Please check your internet and refresh the page.', 4));
        }
        const events = res.status === 200 ? res.data : [];

        // Create the actual list of calendar days by grouping
        // events into their days and adding it to the components list
        let dayComponents = [];
        for (let i = 0; i < totalDays; i++) {
            const currDay = firstDateInMonth.add(i, 'day');
            const currentDayEvents = events.filter((e) => dayjs(e.start).isSame(currDay, 'day'));
            const isToday = dayjs().isSame(currDay, 'day');
            const thisMonth = now.isSame(currDay, 'month');
            dayComponents.push(
                <CalendarDay
                    events={currentDayEvents}
                    date={currDay.date()}
                    key={i}
                    noRight={i % 7 === 6}
                    otherMonth={!thisMonth}
                    isToday={isToday}
                    rows={numRows}
                />
            );
        }

        // Save components to state to display
        setCalendarDays(dayComponents);
        setRows(numRows);
        setMonth(now.format('MMMM YYYY'));
    }, [offset]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarHeaderList = days.map((d) => (
        <Typography className={classes.header} key={d}>
            {d}
        </Typography>
    ));

    const rowClass = rows === 5 ? classes.row5 : rows === 6 ? classes.row6 : classes.row4;
    return (
        <Box display="flex" flexDirection="column" className={classes.wrapper}>
            <AddButton color="primary" path="/edit/events" />
            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                <IconButton size="small" onClick={changeOffset.bind(this, -1)}>
                    <ArrowBackIosRoundedIcon />
                </IconButton>
                <Typography variant="h1" component="h2" className={classes.month}>
                    {month}
                </Typography>
                <IconButton size="small" onClick={changeOffset.bind(this, 1)}>
                    <ArrowForwardIosRoundedIcon />
                </IconButton>
            </Box>
            <Box width="100%" display="flex" marginTop={1}>
                {calendarHeaderList}
            </Box>
            {calendarDays === null ? <Loading /> : <Box className={`${classes.root} ${rowClass}`}>{calendarDays}</Box>}
        </Box>
    );
};

export default Calendar;
