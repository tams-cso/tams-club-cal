import React from 'react';
import { alpha } from '@mui/material';
import { darkSwitch } from '../../../functions/util';
import { Reservation } from '../../../functions/entries';

import TableCell from '@mui/material/TableCell';
import NavLink from '../../shared/navlink';

/**
 * Displays a reservation in the grid, spanning a specific number of columns.
 * This entry in the table also links to the reservation's page.
 *
 * @param {object} props React props object
 * @param {Reservation} props.reservation The reservation data object
 * @param {number} props.span How many hours does the reservation last; this will determine the column span
 * @param {string} [props.sx] Style the ReservationEntry component
 */
const ReservationEntry = (props) => {
    return (
        <TableCell colSpan={props.span || 1} sx={props.sx}>
            <NavLink
                to={`/reservations?id=${props.reservation.id}${props.reservation.repeatEnd ? '&repeating=true' : ''}`}
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
            </NavLink>
        </TableCell>
    );
};

export default ReservationEntry;
