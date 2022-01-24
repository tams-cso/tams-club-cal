import React from 'react';
import { alpha } from '@mui/material';
import { darkSwitch } from '../../util';
import type { Event } from '../../types';

import TableCell from '@mui/material/TableCell';
import Link from '../shared/Link';

interface ReservationEntryProps {
    /** The reservation data object to display */
    reservation: Event;

    /** How many hours does the reservation last; this will determine the column span */
    span: number;

    /** Style the TableCell component */
    sx: object;
}

/**
 * Displays a reservation in the grid, spanning a specific number of columns.
 * This entry in the table also links to the reservation's page.
 */
const ReservationEntry = (props: ReservationEntryProps) => {
    return (
        <TableCell colSpan={props.span || 1} sx={props.sx}>
            <Link
                href={`/events/${props.reservation.id}?view=reservations`}
                sx={{
                    display: 'block',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    backgroundColor: (theme) =>
                        alpha(darkSwitch(theme, theme.palette.primary.light, theme.palette.primary.dark), 0.5),
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                {props.reservation.name}
            </Link>
        </TableCell>
    );
};

export default ReservationEntry;
