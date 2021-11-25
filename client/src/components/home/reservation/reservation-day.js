import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { darkSwitch } from '../../../functions/util';
import { Reservation } from '../../../functions/entries';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ReservationEntry from './reservation-entry';

import data from '../../../data.json';

// Style for a single table cell
const cellStyle = {
    padding: 0.5,
    overflow: 'hidden',
    borderRight: '1px solid',
    borderRightColor: (theme) => darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[800]),
};

/**
 * Creates a grid of reservations for a specific day.
 * This grid is essentially a table with the hours as the columns and each
 * different possible reservation location as the rows.
 *
 * @param {object} props React props object
 * @param {Reservation[]} props.reservationList List of all reservations for the current day
 * @param {dayjs.Dayjs} props.date Current date
 */
const ReservationDay = (props) => {
    const [componentList, setComponentList] = useState(null);

    // When the component mounts, create the list of components from the passed in reservationList
    useEffect(() => {
        const list = [];

        // Iterate through all the rooms
        data.rooms.forEach((room) => {
            // Get the current date to start finding reservations from
            let currTime = props.date.startOf('day');

            // Create the labels for each row, which is the room name
            const row = [
                <TableCell key={room.value} sx={cellStyle}>
                    {room.label}
                </TableCell>,
            ];

            // Iterate through all the hours in a day
            for (let hour = 0; hour < 24; hour++) {
                // Find the first reservation that starts at the current time and is in the current room
                // TODO: Make sure this don't overlap when adding reservations
                const curr = props.reservationList.find(
                    (r) => r.start.isSame(currTime, 'hour') && r.data.location === room.value
                );

                // If there is no reservation at this time, add a blank cell
                // Otherwise, add a ReservationEntry component and increment the
                // current time and the hour variables by the length of the event
                let increment = 1;
                if (!curr || curr.start.isSame(curr.end))
                    row.push(<TableCell key={`${room.value}-${hour}`} sx={cellStyle} />);
                else {
                    row.push(
                        <ReservationEntry reservation={curr.data} span={curr.span} key={curr.data.id} sx={cellStyle} />
                    );
                    increment = curr.span;
                    hour += increment - 1;
                }

                // TODO: remove the increment variable (why does it exist); just increment by hours or smth
                currTime = currTime.add(increment, 'hour');
            }

            // Add the row to the table
            list.push(<TableRow key={room.value}>{row}</TableRow>);
        });

        // Set the state variable to the list of components (which forms the table)
        setComponentList(list);
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
