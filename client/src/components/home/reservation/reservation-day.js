import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 12,
        [theme.breakpoints.up('md')]: {
            overflowX: 'hidden',
        },
    },
    table: {
        tableLayout: 'fixed',
        width: '100%',
        [theme.breakpoints.down('md')]: {
            width: '300%',
        },
    },
    label: {
        width: 150,
        padding: 4,
        textAlign: 'center',
        color: theme.palette.primary.main,
    },
    head: {
        padding: 4,
        textAlign: 'center',
    },
    cell: {
        padding: 4,
        overflow: 'hidden',
        borderRight: '1px solid',
        borderRightColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[800]),
        overflow: 'hidden',
    },
}));

/**
 * Creates a grid of reservations for a specific day
 *
 * @param {object} props React props object
 * @param {Reservation[]} props.reservationList List of all reservations for the current day
 * @param {dayjs.Dayjs} props.date Current date
 */
const ReservationDay = (props) => {
    const [componentList, setComponentList] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        const list = [];
        data.rooms.forEach((room) => {
            let currTime = props.date.startOf('day');
            const row = [
                <TableCell className={classes.cell} key={room.value}>
                    {room.label}
                </TableCell>,
            ];
            var a = 0;
            for (let i = 0; i < 24; i++) {
                const curr = props.reservationList.find(
                    (r) => r.start.isSame(currTime, 'hour') && r.data.location === room.value
                );

                let increment = 1;
                if (!curr || curr.start.isSame(curr.end))
                    row.push(<TableCell className={classes.cell} key={`${room.value}-${i}`} />);
                else {
                    row.push(
                        <ReservationEntry
                            className={classes.cell}
                            reservation={curr.data}
                            span={curr.span}
                            key={curr.data.id}
                        />
                    );
                    increment = curr.span;
                    i += increment - 1;
                }

                currTime = currTime.add(increment, 'hour');
                if (a > 200) console.log({ curr, i });
                if (a++ > 300) break;
            }
            list.push(<TableRow key={room.value}>{row}</TableRow>);
        });
        setComponentList(list);
    }, []);

    return (
        <TableContainer className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.label}>{props.date.format('ddd, MMM DD, YYYY')}</TableCell>
                        {data.hours.map((h, i) => (
                            <TableCell className={classes.head} key={i}>
                                {h}
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
