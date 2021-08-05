import React from 'react';
import { makeStyles, alpha } from '@material-ui/core';
import { darkSwitch } from '../../../functions/util';
import { Reservation } from '../../../functions/entries';

import { Link as NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'block',
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: alpha(darkSwitch(theme, theme.palette.primary.light, theme.palette.primary.dark), 0.5),
    },
}));

/**
 * Displays a reservation in the grid
 *
 * @param {object} props React props object
 * @param {Reservation} props.reservation The reservation data object
 * @param {number} props.span How many hours does the reservation last; this will determine the column span
 * @param {string} [props.className] React className
 */
const ReservationEntry = (props) => {
    const classes = useStyles();
    return (
        <TableCell className={props.className} colSpan={props.span || 1}>
            <Link
                component={NavLink}
                to={`/reservations?id=${props.reservation.id}${props.reservation.repeatEnd ? '&repeating=true' : ''}`}
                className={classes.root}
            >
                {props.reservation.name}
            </Link>
        </TableCell>
    );
};

export default ReservationEntry;
