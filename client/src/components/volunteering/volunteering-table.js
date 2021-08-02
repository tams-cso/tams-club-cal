import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { darkSwitch } from '../../functions/util';
import { Volunteering } from '../../functions/entries';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';

const useStyles = makeStyles((theme) => ({
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
        <TableContainer component={Paper}>
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
                            <TableCell>{v.filters.open ? 'Open' : 'Closed'}</TableCell>
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
