import React, { useEffect, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { Theme } from '@mui/material';
import { darkSwitch } from '../../util/cssUtil';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReservationEntry from './reservation-entry';

import data from '../../data.json';
import Link from '../shared/Link';

// Border color
const borderColor = (theme: Theme) => darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[800]);

// Style for a single table cell
const cellStyle = {
    padding: 0.5,
    overflow: 'hidden',
    borderRight: '1px solid',
    borderRightColor: borderColor,
    borderBottom: '1px solid',
    borderBottomColor: borderColor,
    fontSize: '0.875rem',
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
                <Box key={room.value} sx={{ width: '10.75%', ...cellStyle }}>
                    <Link
                        href={`/events/reservations/room/${room.value}/${props.date.format('YYYY/MM/DD')}`}
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        {room.label}
                    </Link>
                </Box>,
            ];

            // Get the reservations for the current room
            const currRoomRes = props.reservationList.filter((r) => r.data.location === room.value);

            // Iterate through the list of reservations for the current room
            currRoomRes.forEach((res) => {
                row.push(<ReservationEntry res={res} key={res.data.name} />);
            });

            // Add 18 empty divs to draw the empty grid
            for (let i = 0; i < 17; i++) {
                row.push(<Box key={i} sx={{ width: '5.25%', ...cellStyle }} />);
            }

            // Add the row to the table
            table.push(
                <Box key={room.value} sx={{ display: 'flex', position: 'relative' }}>
                    {row}
                </Box>
            );
        });

        // Set the state variable to the list of components (which forms the table)
        setComponentList(table);
    }, [props.reservationList]);

    return (
        <Box sx={{ marginTop: 4, overflowX: { lg: 'hidden', xs: 'scroll' }, width: { lg: '100%', xs: '400%' } }}>
            <Box sx={{ display: 'flex' }}>
                <Typography
                    variant="h1"
                    id={props.date.format('YYYY-MM-DD')}
                    sx={{
                        ...cellStyle,
                        width: '10.75%',
                        margin: 0,
                        textAlign: 'left',
                        paddingLeft: '0.5rem',
                        fontWeight: 500,
                        borderRight: '0px transparent',
                        color: (theme) => theme.palette.primary.main,
                    }}
                >
                    {props.date.format('ddd, MMM DD, YYYY')}
                </Typography>
                {data.hours.map((hour, i) => (
                    <Box
                        key={i}
                        sx={{
                            ...cellStyle,
                            width: '5.25%',
                            textAlign: 'left',
                            paddingLeft: '0.5rem',
                            fontWeight: 500,
                            borderRight: '0px transparent',
                        }}
                    >
                        {hour}
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>{componentList}</Box>
        </Box>
    );
};

export default ReservationDay;
