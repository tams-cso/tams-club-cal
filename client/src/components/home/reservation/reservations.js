import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getReservationList } from '../../../functions/api';

import Box from '@material-ui/core/Box';
import Loading from '../../shared/loading';
import ReservationDay from './reservation-day';
import AddButton from '../../shared/add-button';

const Reservations = () => {
    const [reservationList, setReservationList] = useState(null);
    const [reservationComponentList, setReservationComponentList] = useState(null);
    const [week, setWeek] = useState(dayjs());

    useEffect(async () => {
        const reservations = await getReservationList();
        if (reservations.status !== 200) {
            setReservationComponentList(
                <Loading error>
                    Could not get reservations data. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            );
        }

        const brokenUpReservationList = [];
        reservations.data.forEach((r) => {
            let curr = dayjs(r.start);
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
        setReservationList(sortedReservationList);
    }, []);

    useEffect(() => {
        if (reservationList === null) return;

        const start = week.startOf('week');
        const end = start.add(7, 'day');

        const components = [];
        let currTime = start;
        while (currTime.isBefore(end, 'day')) {
            components.push(
                <ReservationDay
                    reservationList={reservationList.filter((r) => currTime.isSame(dayjs(r.start), 'day'))}
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
            <Box display="flex">Add date select to change date</Box>
            <AddButton color="primary" label="Reservation" path="/edit/reservations" />
            {reservationComponentList === null ? <Loading /> : reservationComponentList}
        </React.Fragment>
    );
};

export default Reservations;
