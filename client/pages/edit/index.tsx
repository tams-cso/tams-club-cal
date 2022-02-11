import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { History, Resource } from '../../src/types';
import { calculateEditDate, darkSwitch, redirect } from '../../src/util';
import { getHistoryList } from '../../src/api';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Loading from '../../src/components/shared/loading';
import EditWrapper from '../../src/components/edit/shared/edit-wrapper';
import TitleMeta from '../../src/components/meta/title-meta';

const Edit = () => {
    const [historyList, setHistoryList] = useState(null);
    const [dataList, setDataList] = useState(null);
    const [noMore, setNoMore] = useState(true);
    const [error, setError] = useState(false);
    const router = useRouter();

    // Redirect user to an add resource page
    const add = (resource: Resource) => router.push(`/edit/${resource}`);

    // Loads more history if the user clicks on the "Load More" button
    const loadMore = async () => {
        // If the historyList is null, do nothing
        if (!historyList) return;

        // Get the next 50 entries, using the last entry's ID as the start ID
        // Update the data/history lists or return an error if the API call fails
        const newHistory = await getHistoryList(historyList[historyList.length - 1].id);
        if (newHistory.status !== 200) {
            setError(true);
            return;
        }
        setDataList([...dataList, ...newHistory.data.dataList]);
        setHistoryList([...historyList, ...newHistory.data.historyList]);

        // If we have gotten all history entries from the beginning of time, set noMore to true
        // This is less likely than the events to hit the end of the list as there will be lots of edits,
        // so the issue of having a total history list that's a multiple of 50 is not a big concern.
        setNoMore(newHistory.data.historyList.length !== 50);
    };

    // On mount, load the history and data lists
    useEffect(() => {
        (async () => {
            // Make the API call and handle errors
            const history = await getHistoryList();
            if (history.status !== 200) {
                setError(true);
                return;
            }
            setDataList(history.data.dataList);
            setHistoryList(history.data.historyList);

            // If there are no more history items, set noMore to true (won't ever happen)
            if (history.data.historyList.length === 50) setNoMore(false);
        })();
    }, []);

    return (
        <EditWrapper>
            <TitleMeta title="Edit" path="/edit" />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: { lg: 'row', xs: 'column' },
                }}
            >
                <Button variant="outlined" onClick={add.bind(this, 'events')} sx={{ margin: 1.5 }}>
                    Add an Event
                </Button>
                <Button variant="outlined" onClick={add.bind(this, 'clubs')} sx={{ margin: 1.5 }}>
                    Add a Club
                </Button>
                <Button variant="outlined" onClick={add.bind(this, 'volunteering')} sx={{ margin: 1.5 }}>
                    Add a Volunteering Opportunity
                </Button>
            </Box>
            <Typography variant="h1" component="h2" sx={{ margin: 2, textAlign: 'center' }}>
                Edit History
            </Typography>
            {!historyList ? (
                <Loading error={error}>
                    Could not get history list. Please check your internet and reload the page.
                </Loading>
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
                            {historyList.map((h: History, i: number) => (
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
                                    onClick={redirect.bind(this, `/edit/history/${h.resource}/${h.editId}?view=list`)}
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
        </EditWrapper>
    );
};

export default Edit;
