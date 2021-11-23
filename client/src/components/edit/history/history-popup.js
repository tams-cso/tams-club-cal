import React from 'react';
import { formatTime } from '../../../functions/util';
import { History } from '../../../functions/entries';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

/**
 * @param {object} props React props object
 * @param {History} props.history List of all events for the current day
 * @param {string} props.name Name of the resource
 * @param {boolean} props.open State variable to check if dialog open
 * @param {Function} props.close Function to run when closing dialog
 */
const HistoryPopup = (props) => {
    const showValue = (value) =>
        typeof value === 'boolean'
            ? value
                ? 'True'
                : 'False'
            : typeof value !== 'string'
            ? JSON.stringify(value)
            : value;
    return (
        <Dialog aria-labelledby="history-popup-title" open={props.open} onClose={props.close} fullWidth>
            {!props.history ? null : (
                <React.Fragment>
                    <DialogTitle id="history-popup-title">{`Edit for ${props.name}`}</DialogTitle>
                    <DialogContent>
                        <Typography>{`Date: ${formatTime(props.history.time, 'MMM DD, YYYY [at] H:mma')}`}</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Key</TableCell>
                                        <TableCell>Old Value</TableCell>
                                        <TableCell>New Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.history.fields.map((f, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{f.key}</TableCell>
                                            <TableCell>{showValue(f.oldValue)}</TableCell>
                                            <TableCell>{showValue(f.newValue)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </React.Fragment>
            )}
        </Dialog>
    );
};

export default HistoryPopup;
