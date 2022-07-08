import React from 'react';
import { formatTime } from '../../../util/datetime';

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
import dayjs from 'dayjs';

import data from '../../../data.json';

interface HistoryPopupProps {
    /** History object to display */
    history: History;

    /** Name to display */
    name: string;

    /** State variable to check if dialog open */
    open: boolean;

    /** Function to run when closing dialog */
    close: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

/**
 * The popup that shows the edits of a single edit history entry for a resource.
 * This component is wrapped in a Dialog component.
 */
const HistoryPopup = (props: HistoryPopupProps) => {
    // Function to parse certain values from the history object
    const showValue = (key: string, value: boolean | object | number | string) => {
        // If location, parse it or return None/name of other location
        // TODO: Add check for bad location name
        if (key === 'location') {
            if (!value) return '[no value]';
            else if (value === 'none') return 'None';
            else if (value === 'other') return value;
            else return data.rooms.find((x) => x.value === value).label;
        }
        switch (typeof value) {
            case 'boolean':
                return value ? 'True' : 'False';
            case 'object':
                return value ? JSON.stringify(value) : '[no value]';
            case 'number':
                return value > 1000000000000 ? dayjs(value).format('MMM D, YYYY @ h:mma') : value;
            default:
                return value;
        }
    };

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
                                            <TableCell>{showValue(f.key, f.oldValue)}</TableCell>
                                            <TableCell>{showValue(f.key, f.newValue)}</TableCell>
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
