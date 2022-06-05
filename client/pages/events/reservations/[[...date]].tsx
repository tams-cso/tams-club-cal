import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dayjs from 'dayjs';
import { getReservationList } from '../../../src/api';
import { AccessLevel, BrokenReservation } from '../../../src/types';
import { getAccessLevel, parseDateParams } from '../../../src/util';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import Loading from '../../../src/components/shared/loading';
import ReservationDay from '../../../src/components/reservations/reservation-day';
import AddButton from '../../../src/components/shared/add-button';
import { useRouter } from 'next/router';
import HomeBase from '../../../src/components/home/home-base';
import TitleMeta from '../../../src/components/meta/title-meta';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Extract params to get the month to use
    const now = parseDateParams(ctx.params.date as string[]);

    // Get the reservation for the given week
    // and send an error if either fails to retrieve
    const reservations = await getReservationList(now.valueOf());
    const level = await getAccessLevel(ctx);
    return {
        props: {
            now: now.valueOf(),
            reservationList: reservations.data,
            error: reservations.status !== 200,
            level,
        },
    };
};

/**
 * The main Reservations page that displays a list of reservations.
 * This page will fetch the list of reservations from the server for a given week,
 * split them by day, and display them in a table by hour.
 * There is also a Date Picker that allows the user to select a different week.
 */
const Reservations = ({
    now,
    reservationList,
    error,
    level,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [reservationComponentList, setReservationComponentList] = useState(null);
    const [week, setWeek] = useState(dayjs(now));

    // Redirect the user to the current week on click
    const goToToday = () => {
        setWeek(dayjs());
    };

    // When the list of reservations updates, re-render the reservation components
    // This will create a table of reservations
    useEffect(() => {
        // If the reservation list is null, do nothing
        if (error) return;

        // Break up reservations into days and sort the reservations
        const brokenUpReservationList: BrokenReservation[] = [];
        reservationList.forEach((r) => {
            // Use variable to track the current day that we are working on
            let curr = dayjs(r.start);

            // If the reservation lasts all day, simply create one day-long entry and return
            // The span attribute corresponds to the number of hours the reservation lasts
            // This will start at 6am and end at midnight the next day, spanning 18 hours
            if (r.allDay) {
                brokenUpReservationList.push({
                    start: curr.startOf('day').add(6, 'hour'),
                    end: curr.startOf('day').add(1, 'day'),
                    span: 18,
                    data: r,
                });
                return;
            }

            // Iterate through the days until we reach the end of the reservation
            // This is useful for splitting up reservations that span multiple days
            while (!curr.isSame(dayjs(r.end), 'day')) {
                // If the current hour is 23 and the "end" of the event is within the next hour, break
                // This is to prevent events that end at midnight from appearing on the next day
                if (curr.hour() === 23 && curr.add(1, 'hour').isSame(dayjs(r.end), 'hour')) break;

                // Calculate the number of hours between the current hour and the end of the day
                const currEnd = curr.add(1, 'day').startOf('day');
                const currSpan = currEnd.diff(curr, 'hour');

                // Create an entry for the section of the event that spans this day
                // This entry will span the entire length of the day if it crosses over the entire day
                // However, the span will be less than 24 if it is less than the entire day
                brokenUpReservationList.push({ start: curr, end: currEnd, span: currSpan, data: r });
                curr = currEnd;
            }

            // Now we calculate the number of hours between the current hour and the end of the reservation
            // This is because the while loop will break on the last day of the reservation and we must
            // push the last segment on manually
            const span = dayjs(r.end).diff(curr, 'hour');
            brokenUpReservationList.push({ start: curr, end: dayjs(r.end), span, data: r });
        });

        // The reservation list is sorted by start date
        const sortedReservationList = brokenUpReservationList.sort((a, b) => a.start.valueOf() - b.start.valueOf());

        // Create a cut reservation list that only contains reservation blocks that
        // start at 6am or after -> this will remove all blocks between 12am and 6am
        // and truncate blocks that start within this interval but end after
        const cutReservationList = [];
        sortedReservationList.forEach((r) => {
            // If the reservation starts outside of the interval, simply add it to the list
            if (r.start.hour() >= 6) {
                cutReservationList.push(r);
            } else {
                // If the reservation starts within the 6am-12am interval,
                // and ends after this interval, keep the block but truncate the start
                // Otherwise we will simply ignore the block and remove it from the list
                if (r.end.hour() >= 6 || r.end.day() !== r.start.day()) {
                    const diff = 6 - r.start.hour();
                    cutReservationList.push({ ...r, start: r.start.hour(6), span: r.span - diff });
                }
            }
        });

        // Calculate start/end dates for list
        const start = week.startOf('week');
        const end = start.add(7, 'day');

        // Create the actual reservation components by iterating through the sorted list
        // and incrementing days when the next event in the sorted list is on the next day
        // This will continue to increment until the last day of the week
        // TODO: Add a catch for an infinite loop
        const components = [];
        let currTime = start;
        while (currTime.isBefore(end, 'day')) {
            components.push(
                <ReservationDay
                    reservationList={cutReservationList.filter((r) => currTime.isSame(dayjs(r.start), 'day'))}
                    date={currTime}
                    key={currTime.valueOf()}
                />
            );
            currTime = currTime.add(1, 'day');
        }

        // Update the state variable with the list of reservations
        setReservationComponentList(
            <Box display="flex" flexDirection="column">
                {components}
            </Box>
        );
    }, [reservationList]);

    // Redirect the user to the new week if it changes and is not the same as the current
    useEffect(() => {
        // If the week is invalid (ie. user manually changed the text input), do nothing
        if (isNaN(week.valueOf())) return;

        // If the week is the same as before, don't do anything either
        if (week.isSame(now, 'week')) return;

        // Otherwise, redirect the user to the new week
        router.push(`/events/reservations/${week.format('YYYY/M/D')}`);
    }, [week]);

    // Send error if cannot get data
    if (error) {
        return (
            <HomeBase noDrawer>
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get reservation list. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            </HomeBase>
        );
    }

    return (
        <HomeBase noDrawer>
            <TitleMeta title="Reservations" path="/events/reservations" />
            <Box display="flex">
                <DatePicker
                    inputFormat="[Week of] MMM D, YYYY"
                    label="Select week to show"
                    value={week}
                    onChange={setWeek}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" sx={{ marginLeft: { sm: 4, xs: 2 } }} />
                    )}
                />
                <Button variant="outlined" onClick={goToToday} sx={{ mx: 2 }}>
                    Today
                </Button>
            </Box>
            <AddButton color="primary" label="Event" path="/edit/events" disabled={level < AccessLevel.STANDARD} />
            {reservationComponentList === null ? <Loading /> : reservationComponentList}
        </HomeBase>
    );
};

export default Reservations;
