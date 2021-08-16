import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getRepeatingReservationList, getReservationList } from '../../../functions/api';

import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';
import Loading from '../../shared/loading';
import ReservationDay from './reservation-day';
import AddButton from '../../shared/add-button';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    date: {
        marginLeft: 24,
        [theme.breakpoints.down('sm')]: {
            margin: 'auto',
        },
    },
}));

const Reservations = () => {
    const [reservationList, setReservationList] = useState(null);
    const [reservationComponentList, setReservationComponentList] = useState(null);
    const [week, setWeek] = useState(dayjs());
    const classes = useStyles();

    const getData = async (offset) => {
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
        setReservationList({ reservations: reservations.data, repeatingReservations: repeatingReservations.data });
    };

    useEffect(getData, []);

    useEffect(getData.bind(this, true), [week]);

    useEffect(() => {
        if (reservationList === null) return;

        // Add repeating events to the reservation list
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
            let curr = dayjs(r.start);
            if (r.allDay) {
                brokenUpReservationList.push({
                    start: curr.startOf('day'),
                    end: curr.startOf('day').add(1, 'day'),
                    span: 24,
                    data: r,
                });
            }

            while (!curr.isSame(dayjs(r.end), 'day')) {
                if (curr.hour() === 23 && curr.add(1, 'hour').isSame(dayjs(r.end), 'hour')) break;
                const currEnd = curr.add(1, 'day').startOf('day');
                const currSpan = currEnd.diff(curr, 'hour');
                brokenUpReservationList.push({ start: curr, end: currEnd, span: currSpan, data: r });
                curr = currEnd;
            }
            const span = dayjs(r.end).diff(curr, 'hour');
            brokenUpReservationList.push({ start: curr, end: dayjs(r.end), span, data: r });
        });
        const sortedReservationList = brokenUpReservationList.sort((a, b) => a.start - b.start);

        // Calculate start/end dates for list
        const start = week.startOf('week');
        const end = start.add(7, 'day');

        // Create the actual reservation components
        const components = [];
        let currTime = start;
        while (currTime.isBefore(end, 'day')) {
            components.push(
                <ReservationDay
                    reservationList={sortedReservationList.filter((r) => currTime.isSame(dayjs(r.start), 'day'))}
                    date={currTime}
                    key={currTime.valueOf()}
                />
            );
            currTime = currTime.add(1, 'day');
        }
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
                    inputVariant="standard"
                    format="[Week of] MMM Do, YYYY"
                    label="Select week to show"
                    value={week}
                    onChange={setWeek}
                    className={classes.date}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <EventIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <AddButton color="primary" label="Reservation" path="/edit/reservations" />
            {reservationComponentList === null ? <Loading /> : reservationComponentList}
        </React.Fragment>
    );
};

export default Reservations;
