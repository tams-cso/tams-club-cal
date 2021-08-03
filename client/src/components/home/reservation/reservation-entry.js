import React from 'react';
import { makeStyles } from '@material-ui/core';
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
        backgroundColor: theme.palette.secondary.dark,
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
            <Link component={NavLink} to={`/reservations?id=${props.reservation.id}`} className={classes.root}>
                {props.reservation.name}
            </Link>
        </TableCell>
    );
};

export default ReservationEntry;
