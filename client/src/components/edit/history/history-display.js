import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { calculateEditDate, darkSwitch, getParams, parseEditor, redirect } from '../../../functions/util';
import { getHistory } from '../../../functions/api';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Loading from '../../shared/loading';
import HistoryPopup from './history-popup';

const useStyles = makeStyles((theme) => ({
    centerTitle: {
        textAlign: 'center',
        marginBottom: 12,
    },
    tableLink: {
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    centerButton: {
        margin: 'auto',
        marginTop: 12,
        display: 'block',
    },
}));

/**
 * Displays a list of history entries for a specific object
 *
 * @param {object} props React props object
 * @param {"events" | "clubs" | "volunteering" | "reservations"} props.resource The name of the resource to show history for
 */
const HistoryDisplay = (props) => {
    const [historyList, setHistoryList] = useState(null);
    const [name, setName] = useState(null);
    const [components, setComponents] = useState(null);
    const [currHistory, setCurrHistory] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const resource = props.match.params.resource;
    const location = useLocation();
    const classes = useStyles();

    const openPopup = (index) => {
        setCurrHistory(index);
        setPopupOpen(true);
    };

    const back = () => {
        const view = getParams('view');
        if (view) redirect('/edit');
        else redirect('/edit' + location.pathname.split('/edit/history')[1] + location.search);
    };

    useEffect(async () => {
        const queryId = getParams('id');
        if (!queryId) {
            setComponents(<Loading error>No ID defined! Please return to the home page.</Loading>);
            return;
        }

        const history = await getHistory(resource, queryId);
        if (history.status !== 200) {
            setComponents(
                <Loading error>Invalid {resource} ID. Please return to the home page and check the ID.</Loading>
            );
            return;
        }
        setHistoryList(history.data.history.sort((a, b) => b.time - a.time));
        setName(history.data.name);
    }, []);

    useEffect(async () => {
        if (historyList === null) return;

        setComponents(
            await Promise.all(
                historyList.map(async (h, i) => (
                    <TableRow onClick={openPopup.bind(this, i)} className={classes.tableLink} key={i}>
                        <TableCell>{calculateEditDate(h.time)}</TableCell>
                        <TableCell>{`${h.fields.length} fields were updated`}</TableCell>
                        <TableCell>{await parseEditor(h.editor)}</TableCell>
                    </TableRow>
                ))
            )
        );
    }, [historyList]);

    return (
        <TableContainer>
            {components === null ? (
                <Loading />
            ) : (
                <React.Fragment>
                    <Helmet>
                        <title>{name} | Edit History - TAMS Club Calendar</title>
                    </Helmet>
                    <Typography variant="h1" className={classes.centerTitle}>{`Edit History for ${name}`}</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Edits</TableCell>
                                <TableCell>Editor</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{components}</TableBody>
                    </Table>
                    <HistoryPopup
                        history={historyList[currHistory]}
                        name={name}
                        open={popupOpen}
                        close={setPopupOpen.bind(this, false)}
                    />
                    <Button onClick={back} className={classes.centerButton}>
                        Back
                    </Button>
                </React.Fragment>
            )}
        </TableContainer>
    );
};

export default HistoryDisplay;
