import React, { useEffect, useState } from 'react';
import { calculateEditDate, darkSwitch, redirect } from '../../../util';
import { getHistoryList } from '../../../api';

import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Loading from '../../shared/loading';

/**
 * Shows a list of all the edits made, in reverse chronological order.
 */
const HistoryList = () => {

    return (
        <React.Fragment>
        </React.Fragment>
    );
};

export default HistoryList;
