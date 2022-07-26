import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { AccessLevelEnum } from '../../src/types/enums';
import { getTokenFromCookies, redirect } from '../../src/util/miscUtil';
import { calculateEditDate } from '../../src/util/datetime';
import { darkSwitch } from '../../src/util/cssUtil';
import { getHistoryList, getUserInfo } from '../../src/api';

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
import AccessInfo from '../../src/components/edit/history/access-info';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const token = getTokenFromCookies(ctx);
    const userRes = await getUserInfo(token);
    return { props: { level: userRes.status === 200 ? userRes.data.level : AccessLevelEnum.NONE } };
};

const Edit = ({ level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [historyList, setHistoryList] = useState(null);
    const [dataList, setDataList] = useState<HistoryData[]>(null);
    const [noMore, setNoMore] = useState(true);
    const [error, setError] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
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

    // Returns either "Resource created" if first event or returns # of updated fields
    const getEdits = (h: History): string => {
        // If the edit content contains the name and the oldName was null, that means it's the initial edit
        const name = h.fields.find((hk) => hk.key === 'name');
        if (name && name.oldValue === null) {
            return 'Resource created';
        }

        // Otherwise, return the number of updated fields
        return `${h.fields.length} fields were updated`;
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
            <AccessInfo open={infoOpen} setOpen={setInfoOpen} />
            <Typography variant="h1" component="h2" sx={{ margin: 2, textAlign: 'center' }}>
                Edit History
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: { lg: 'row', xs: 'column' },
                }}
            >
                {/* TODO: Convert these buttons to a simple component (with the add function) */}
                <Button
                    variant="outlined"
                    onClick={add.bind(this, 'events')}
                    sx={{ margin: 1.5 }}
                    disabled={level < AccessLevelEnum.STANDARD}
                >
                    Add an Event
                </Button>
                <Button
                    variant="outlined"
                    onClick={add.bind(this, 'clubs')}
                    sx={{ margin: 1.5 }}
                    disabled={level < AccessLevelEnum.CLUBS}
                >
                    Add a Club
                </Button>
                <Button
                    variant="outlined"
                    onClick={add.bind(this, 'volunteering')}
                    sx={{ margin: 1.5 }}
                    disabled={level < AccessLevelEnum.CLUBS}
                >
                    Add a Volunteering Opportunity
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="text" onClick={setInfoOpen.bind(this, true)} sx={{ marginBottom: 1 }}>
                    Why can I not add/modify a resource?
                </Button>
            </Box>
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
                                    onClick={redirect.bind(
                                        this,
                                        `/edit/history/${h.resource}/${h.resourceId}?view=list&editId=${h.id}`
                                    )}
                                >
                                    <TableCell>{calculateEditDate(h.time)}</TableCell>
                                    <TableCell>{h.resource}</TableCell>
                                    <TableCell>{dataList[i].name}</TableCell>
                                    <TableCell>{getEdits(h)}</TableCell>
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
