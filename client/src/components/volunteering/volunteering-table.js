import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch } from '../../functions/util';
import { Volunteering } from '../../functions/entries';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 24,
    },
    centerIcon: {
        textAlign: 'center',
    },
    tableLink: {
        textDecoration: 'none',
        color: 'inherit',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    open: {
        color: theme.palette.primary.main,
    },
    closed: {
        color: theme.palette.error.main,
    },
}));

/**
 * Displays the volunteering opportunities in a table
 *
 * @param {object} props React props object
 * @param {Volunteering[]} props.volunteering Volunteering list
 */
const VolunteeringTable = (props) => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper} className={classes.root}>
            <Table aria-label="volunteering table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Club</TableCell>
                        <TableCell>Open</TableCell>
                        <TableCell>Limited Spots</TableCell>
                        <TableCell>Semester Committment</TableCell>
                        <TableCell>Set Times</TableCell>
                        <TableCell>Repeats Weekly</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.volunteering.map((v) => (
                        <TableRow
                            component={Link}
                            to={`/volunteering?id=${v.id}&view=list`}
                            className={classes.tableLink}
                        >
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>
                            <TableCell>{v.club}</TableCell>
                            <TableCell className={v.filters.open ? classes.open : classes.closed}>
                                {v.filters.open ? 'Open' : 'Closed'}
                            </TableCell>
                            <TableCell className={classes.centerIcon}>
                                {v.filters.limited ? <DashboardRoundedIcon htmlColor="#ffb258" /> : ''}
                            </TableCell>
                            <TableCell className={classes.centerIcon}>
                                {v.filters.semester ? <EventNoteRoundedIcon htmlColor="#ff8b99" /> : ''}
                            </TableCell>
                            <TableCell className={classes.centerIcon}>
                                {v.filters.setTimes ? <ScheduleRoundedIcon htmlColor="#abb8ff" /> : ''}
                            </TableCell>
                            <TableCell className={classes.centerIcon}>
                                {v.filters.weekly ? <EventRoundedIcon htmlColor="#d38cff" /> : ''}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VolunteeringTable;
