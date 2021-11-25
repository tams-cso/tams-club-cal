import React, { useEffect, useState } from 'react';
import { calculateEditDate, darkSwitch, redirect } from '../../../functions/util';
import { getHistoryList } from '../../../functions/api';

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
    const [historyList, setHistoryList] = useState(null);
    const [dataList, setDataList] = useState(null);
    const [noMore, setNoMore] = useState(true);

    // On mount, load the history and data lists
    useEffect(async () => {
        // Make the API call and handle errors
        const history = await getHistoryList();
        if (history.status !== 200) {
            setHistoryList(
                <Loading error>Could not get history list. Please check your internet and reload the page.</Loading>
            );
            return;
        }
        setDataList(history.data.dataList);
        setHistoryList(history.data.historyList);

        // If there are no more history items, set noMore to true (won't ever happen)
        if (history.data.historyList.length === 50) setNoMore(false);
    }, []);

    // Loads more history if the user clicks on the "Load More" button
    const loadMore = async () => {
        // If the historyList is null, do nothing
        if (!historyList) return;

        // Get the next 50 entries, using the last entry's ID as the start ID
        // Update the data/history lists or return an error if the API call fails
        const history = await getHistoryList(historyList[historyList.length - 1].id);
        if (history.status !== 200) {
            setHistoryList(
                <Loading error>Could not get history list. Please check your internet and reload the page.</Loading>
            );
            return;
        }
        setDataList([...dataList, ...history.data.dataList]);
        setHistoryList([...historyList, ...history.data.historyList]);

        // If we have gotten all history entries from the beginning of time, set noMore to true
        // This is less likely than the events to hit the end of the list as there will be lots of edits,
        // so the issue of having a total history list that's a multiple of 50 is not a big concern.
        setNoMore(history.data.historyList.length !== 50);
    };

    return (
        <React.Fragment>
            <Typography variant="h1" component="h2" sx={{ margin: 2, textAlign: 'center' }}>
                Edit History
            </Typography>
            {!historyList ? (
                <Loading />
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Resource</TableCell>
                                <TableCell>Curent Name</TableCell>
                                <TableCell>Edits</TableCell>
                                <TableCell>Editor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historyList.map((h, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        transition: '0.3s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: (theme) =>
                                                darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
                                        },
                                    }}
                                    onClick={redirect.bind(
                                        this,
                                        `/edit/history/${h.resource}?id=${h.editId}&view=list`
                                    )}
                                >
                                    <TableCell>{calculateEditDate(h.time)}</TableCell>
                                    <TableCell>{h.resource}</TableCell>
                                    <TableCell>{dataList[i].name}</TableCell>
                                    <TableCell>
                                        {dataList[i].first
                                            ? 'Resource created'
                                            : `${h.fields.length} fields were updated`}
                                    </TableCell>
                                    <TableCell>{dataList[i].editor}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Button onClick={loadMore} disabled={noMore} sx={{ margin: '12px auto', display: 'block' }}>
                Load more
            </Button>
        </React.Fragment>
    );
};

export default HistoryList;
