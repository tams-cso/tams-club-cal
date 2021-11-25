import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getRepeatingReservationList, getReservationList } from '../../../functions/api';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import Loading from '../../shared/loading';
import ReservationDay from './reservation-day';
import AddButton from '../../shared/add-button';

/**
 * The main Reservations page that displays a list of reservations.
 * This page will fetch the list of reservations from the server for a given week,
 * split them by day, and display them in a table by hour.
 * There is also a Date Picker that allows the user to select a different week.
 */
const Reservations = () => {
    const [reservationList, setReservationList] = useState(null);
    const [reservationComponentList, setReservationComponentList] = useState(null);
    const [week, setWeek] = useState(dayjs());

    // That will get data from the server and set the state variable
    const getData = async (offset) => {
        // If the week is invalid (ie. user manually changed the text input), do nothing
        if (isNaN(week.valueOf())) return;

        // Get the reservation and repeating reservation lists for the given week
        // and send an error if either fails to retrieve
        const reservations = await getReservationList(offset ? week.valueOf() : null);
        const repeatingReservations = await getRepeatingReservationList(offset ? week.valueOf() : null);
        if (reservations.status !== 200 || repeatingReservations.status !== 200) {
            setReservationComponentList(
                <Loading error>
                    Could not get reservations data. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            );
            return;
        }

        // Set the state variable with the reservations and repeating reservations
        setReservationList({ reservations: reservations.data, repeatingReservations: repeatingReservations.data });
    };

    // Run getData on mount
    useEffect(getData, []);

    // Also run getData if the week changes
    // TODO: Why tf does this need to be a seperate call lmao?
    useEffect(getData.bind(this, true), [week]);

    // When the list of reservations updates, re-render the reservation components
    useEffect(() => {
        // If the reservation list is null, do nothing
        if (reservationList === null) return;

        console.log(reservationList);

        // Add repeating events to the reservation list
        // Since repeating reservation will repeat weekly, we simply just add one instance of
        // that repeating reservation on the day and time that it would occur
        const combinedReservationList = [
            ...reservationList.reservations,
            ...reservationList.repeatingReservations.map((r) => {
                const start = week.day(dayjs(r.start).day()).hour(dayjs(r.start).hour()).valueOf();
                const tempEnd = week.day(dayjs(r.end).day()).hour(dayjs(r.end).hour());
                const end = tempEnd.isBefore(start) ? tempEnd.add(1, 'week').valueOf() : tempEnd.valueOf();
                return { ...r, start, end };
            }),
        ];

        // Break up reservations into days and sort the reservations
        const brokenUpReservationList = [];
        combinedReservationList.forEach((r) => {
            // Use variable to track the current day that we are working on
            let curr = dayjs(r.start);

            // If the reservation lasts all day, simply create one day-long entry and return
            // The span attribute corresponds to the number of hours the reservation lasts
            // This will start at 6am and end at midnight the next day, spanning 18 hours
            if (r.allDay) {
                console.log(r);
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
        const sortedReservationList = brokenUpReservationList.sort((a, b) => a.start - b.start);

        console.log(sortedReservationList);

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

    return (
        <React.Fragment>
            <Box display="flex">
                <DatePicker
                    inputFormat="[Week of] MMM D, YYYY"
                    label="Select week to show"
                    value={week}
                    onChange={setWeek}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            sx={{ marginRight: 'auto', marginLeft: { lg: 4, xs: 'auto' } }}
                        />
                    )}
                />
            </Box>
            <AddButton color="primary" label="Reservation" path="/edit/reservations" />
            {reservationComponentList === null ? <Loading /> : reservationComponentList}
        </React.Fragment>
    );
};

export default Reservations;
