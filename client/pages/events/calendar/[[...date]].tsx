import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { getAccessLevel } from '../../../src/util/miscUtil';
import { parsePublicEventList } from '../../../src/util/dataParsing';
import { parseDateParams } from '../../../src/util/datetime';
import { darkSwitch } from '../../../src/util/cssUtil';
import { getPublicEventListInRange } from '../../../src/api';
import { AccessLevelEnum } from '../../../src/types/enums';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import HomeBase from '../../../src/components/home/home-base';
import CalendarDay from '../../../src/components/calendar/calendar-day';
import Loading from '../../../src/components/shared/loading';
import AddButton from '../../../src/components/shared/add-button';
import TitleMeta from '../../../src/components/meta/title-meta';

// Template rows for each number of possible calendar rows
const rowStyles = {
    4: { gridTemplateRows: 'repeat(4, minmax(0, 1fr))' },
    5: { gridTemplateRows: 'repeat(5, minmax(0, 1fr))' },
    6: { gridTemplateRows: 'repeat(6, minmax(0, 1fr))' },
};

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Extract params to get the month to use
    const now = parseDateParams(ctx.params.date as string[]);

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
    let res = await getPublicEventListInRange(startOfPrevMonth.valueOf(), endOfNextMonth.valueOf());
    const error = res.status !== 200;
    const level = await getAccessLevel(ctx);
    return {
        props: {
            activities: res.data,
            error,
            firstDateInMonth: firstDateInMonth.valueOf(),
            numRows,
            totalDays,
            now: now.valueOf(),
            level,
        },
    };
};

/**
 * The main Calendar page that fetches the data
 * and splits up the events into days, creating lists of CalendarDay components
 * to display to the user in a grid with a calculated number of rows.
 */
const Calendar = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [calendarDays, setCalendarDays] = useState(null);
    const [month, setMonth] = useState(null);
    const [rows, setRows] = useState(0);
    const now = dayjs(props.now);

    // Adjust the offset of month when user clicks on the arrow buttons
    // The change that is passed in will be +1 or -1 depending on which arrow button was clicked
    const offsetMonth = (forward: boolean) => {
        const newMonth = forward ? now.add(1, 'month') : now.subtract(1, 'month');
        router.push(`/events/calendar/${newMonth.format('YYYY/M')}`);
    };

    // Once the events are fetched, they are parsed by splitting multi-day events
    // These events are then grouped by date and each calendar day is created
    useEffect(() => {
        if (props.error) return;

        // Parse the fetched events by splitting multi-day events into separate event objects
        const events = parsePublicEventList(props.activities);

        // Create the actual list of calendar days by grouping
        // events into their days and adding it to the components list
        let dayComponents = [];
        for (let i = 0; i < props.totalDays; i++) {
            // Get the current day by adding i number of days to the first in the month
            const currDay = dayjs(props.firstDateInMonth).add(i, 'day');

            // Filter out the events for the current day from the events list
            const currentDayEvents = events.filter((e) => dayjs(e.start).isSame(currDay, 'day'));

            // If the CalendarDay is the current date or this month, style it differently
            const isToday = dayjs().isSame(currDay, 'day');
            const thisMonth = now.isSame(currDay, 'month');

            // Add a CalendarDay to the list of components
            dayComponents.push(
                <CalendarDay
                    activities={currentDayEvents}
                    date={currDay}
                    key={i}
                    noRight={i % 7 === 6}
                    otherMonth={!thisMonth}
                    isToday={isToday}
                    rows={props.numRows}
                />
            );
        }

        // Save components to state variables to display
        setCalendarDays(dayComponents);
        setRows(props.numRows);
        setMonth(now.format('MMMM YYYY'));
    }, [props.activities]);

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
        <HomeBase unsetHeight>
            <TitleMeta title="Calendar" path="/events/calendar" />
            <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
                <AddButton
                    color="primary"
                    label="Event"
                    path={props.level < AccessLevelEnum.STANDARD ? "/profile?prev=/edit/events" : "/edit/events"}
                />
                <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                    <IconButton size="small" onClick={offsetMonth.bind(this, false)}>
                        <ArrowBackIosRoundedIcon />
                    </IconButton>
                    <Typography variant="h1" component="h2" sx={{ width: 250, textAlign: 'center' }}>
                        {month}
                    </Typography>
                    <IconButton size="small" onClick={offsetMonth.bind(this, true)}>
                        <ArrowForwardIosRoundedIcon />
                    </IconButton>
                </Box>
                <Box width="100%" display="flex" marginTop={1}>
                    {calendarHeaderList}
                </Box>
                {calendarDays === null ? (
                    <Loading sx={{ marginTop: 3 }} />
                ) : (
                    <Box
                        sx={{
                            borderTop: 'solid 1px',
                            borderTopColor: (theme) =>
                                darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700]),
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
        </HomeBase>
    );
};

export default Calendar;
