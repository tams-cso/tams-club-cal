import React from 'react';
import { darkSwitch } from '../../util/cssUtil';

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
import Loading from '../shared/loading';
import Link from '../shared/Link';

/**
 * Displays the volunteering opportunities in a table
 *
 * @param {object} props React props object
 * @param {Volunteering[]} props.volunteering Volunteering list
 */
const VolunteeringTable = (props) => {
    return props.volunteering === null ? (
        <Loading />
    ) : (
        <TableContainer component={Paper} sx={{ marginBottom: 8 }}>
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
                            href={`/volunteering/${v.id}?view=table`}
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                transition: '0.3s',
                                '&:hover': {
                                    backgroundColor: (theme) =>
                                        darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>
                            <TableCell>{v.club}</TableCell>
                            <TableCell sx={{ color: v.filters.open ? 'primary.main' : 'error.main' }}>
                                {v.filters.open ? 'Open' : 'Closed'}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {v.filters.limited ? <DashboardRoundedIcon htmlColor="#ffb258" /> : ''}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {v.filters.semester ? <EventNoteRoundedIcon htmlColor="#ff8b99" /> : ''}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                {v.filters.setTimes ? <ScheduleRoundedIcon htmlColor="#abb8ff" /> : ''}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
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
