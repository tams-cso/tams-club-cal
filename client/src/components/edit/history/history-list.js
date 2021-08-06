import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { getHistoryList } from '../../../functions/api';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Loading from '../../shared/loading';
import { calculateEditDate, darkSwitch, redirect } from '../../../functions/util';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        marginTop: 12,
    },
    tableLink: {
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    button: {
        margin: '12px auto',
        display: 'block',
    },
}));

const HistoryList = () => {
    const [historyList, setHistoryList] = useState(null);
    const [dataList, setDataList] = useState(null);
    const [noMore, setNoMore] = useState(true);
    const classes = useStyles();

    const loadButton = () => {
        setNoMore(true);
        loadMore();
    };
    const loadMore = async () => {
        if (!historyList) return;

        const history = await getHistoryList(historyList[historyList.length - 1].id);
        if (history.status !== 200) {
            setHistoryList(
                <Loading error>Could not get history list. Please check your internet and reload the page.</Loading>
            );
            return;
        }
        setDataList([...dataList, ...history.data.dataList]);
        setHistoryList([...historyList, ...history.data.historyList]);
        if (history.data.historyList.length === 50) setNoMore(false);
    };

    useEffect(async () => {
        const history = await getHistoryList();
        if (history.status !== 200) {
            setHistoryList(
                <Loading error>Could not get history list. Please check your internet and reload the page.</Loading>
            );
            return;
        }
        setDataList(history.data.dataList);
        setHistoryList(history.data.historyList);
        if (history.data.historyList.length === 50) setNoMore(false);
    }, []);

    return (
        <React.Fragment>
            <Typography variant="h1" component="h2" className={classes.title}>
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
                                    className={classes.tableLink}
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
            <Button onClick={loadButton} className={classes.button} disabled={noMore}>
                Load more
            </Button>
        </React.Fragment>
    );
};

export default HistoryList;
