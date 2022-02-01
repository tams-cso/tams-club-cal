import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { Theme } from '@mui/material';
import { darkSwitch } from '../../util';
import type { BrokenReservation } from '../../types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ReservationEntry from './reservation-entry';

import data from '../../data.json';

// Style for a single table cell
const cellStyle = {
    padding: 0.5,
    overflow: 'hidden',
    borderRight: '1px solid',
    borderRightColor: (theme: Theme) => darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[800]),
};

interface ReservationDayProps {
    /** List of all reservations for the current day */
    reservationList: BrokenReservation[];

    /** The current date */
    date: Dayjs;
}

/**
 * Creates a grid of reservations for a specific day.
 * This grid is essentially a table with the hours as the columns and each
 * different possible reservation location as the rows.
 */
const ReservationDay = (props: ReservationDayProps) => {
    const [componentList, setComponentList] = useState(null);

    // When the component mounts, create the list of components from the passed in reservationList
    useEffect(() => {
        const table = [];

        // Iterate through all the rooms
        data.rooms.forEach((room) => {
            // Create the labels for each row, which is the room name
            const row = [
                <TableCell key={room.value} sx={cellStyle}>
                    {room.label}
                </TableCell>,
            ];

            // Get the current date to start finding reservations from
            let currTime = props.date.startOf('day').add(6, 'hour');

            // Iterate through all the hours in a day (starting from 6am)
            for (let hour = 6; hour < 24; hour++) {
                // Find the first reservation that starts at the current time and is in the current room
                // THIS SHOULD BE UNIQUE!!! (As long as the adding system prevents users from overlapping)
                const curr = props.reservationList.find(
                    (r) => dayjs(r.start).isSame(currTime, 'hour') && r.data.location === room.value
                );

                // If there is no reservation at this time, add a blank cell
                // Otherwise, add a ReservationEntry component and increment the
                // current time and the hour variables by the length of the event
                let increment = 1;
                if (!curr || dayjs(curr.start).isSame(curr.end))
                    row.push(<TableCell key={`${room.value}-${hour}`} sx={cellStyle} />);
                else {
                    row.push(
                        <ReservationEntry reservation={curr.data} span={curr.span} key={curr.data.id} sx={cellStyle} />
                    );
                    increment = Math.max(1, curr.span);
                    hour += increment - 1;
                }

                // TODO: remove the increment variable (why does it exist); just increment by hours or smth
                currTime = currTime.add(increment, 'hour');
            }

            // Add the row to the table
            table.push(<TableRow key={room.value}>{row}</TableRow>);
        });

        // Set the state variable to the list of components (which forms the table)
        setComponentList(table);
    }, []);

    return (
        <TableContainer sx={{ marginTop: 3, overflowX: { lg: 'hidden', xs: 'scroll' } }}>
            <Table sx={{ tableLayout: 'fixed', width: { lg: '100%', xs: '300%' } }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                width: 150,
                                padding: 1,
                                textAlign: 'center',
                                color: (theme) => theme.palette.primary.main,
                            }}
                        >
                            {props.date.format('ddd, MMM DD, YYYY')}
                        </TableCell>
                        {data.hours.map((hour, i) => (
                            <TableCell key={i} sx={{ padding: 1, textAlign: 'center' }}>
                                {hour}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>{componentList}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReservationDay;
