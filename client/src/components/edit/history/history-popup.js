import React from 'react';
import { formatTime } from '../../../functions/util';
import { History } from '../../../functions/entries';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
