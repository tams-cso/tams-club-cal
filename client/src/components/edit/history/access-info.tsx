import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

interface AccessInfoProps {
    /** True if popup is opened */
    open: boolean;

    /** Function to set the open state variable */
    setOpen: Function;
}

const AccessInfo = (props: AccessInfoProps) => {
    const handleClose = () => {
        props.setOpen(false);
    };

    // These access levels align with the table headers below
    // 0 = no, 1 = yes, 2 = conditional
    const accessInfo = [
        { l: 'Public', p: [1, 0, 0, 0, 0, 0, 0] },
        { l: 'Standard', p: [1, 1, 2, 0, 0, 0, 0] },
        { l: 'Clubs', p: [1, 1, 2, 1, 1, 1, 1] },
        { l: 'Admin', p: [1, 1, 1, 1, 1, 1, 1] },
    ];

    const emojiMap = ['❌', '✅', '⚠️'];

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>User Access Levels</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 1000 }} aria-label="access level table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Access Level</TableCell>
                                <TableCell align="center">Read Resources</TableCell>
                                <TableCell align="center">Create Event</TableCell>
                                <TableCell align="center">Modify Event</TableCell>
                                <TableCell align="center">Create Volunteering</TableCell>
                                <TableCell align="center">Modify Volunteering</TableCell>
                                <TableCell align="center">Create Club</TableCell>
                                <TableCell align="center">Modify Club</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accessInfo.map((level, ind) => (
                                <TableRow key={ind}>
                                    <TableCell key="hi">{level.l}</TableCell>
                                    {level.p.map((entry, i) => (
                                        <TableCell align="center" key={i}>
                                            {emojiMap[entry]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography sx={{ marginTop: 3, textAlign: 'center' }}>
                    ⚠️ Events may only be modified by the users that created them ⚠️
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default AccessInfo;
