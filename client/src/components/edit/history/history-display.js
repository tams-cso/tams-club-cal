import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import makeStyles from '@mui/styles/makeStyles';
import { calculateEditDate, darkSwitch, getParams, parseEditor, redirect } from '../../../functions/util';
import { getHistory } from '../../../functions/api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Loading from '../../shared/loading';
import HistoryPopup from './history-popup';
import Title from '../../shared/title';

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

// TODO: Check to see if the object is valid!!!!!!!!!!!!!!!!

/**
 * Displays a list of history entries for a specific object.
 * /edit/history/:resource will route to this component.
 *
 * @param {object} props React props object
 * @param {"events" | "clubs" | "volunteering" | "reservations"} props.resource The name of the resource to show history for
 * @param {object} props.match The react-router match object
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

    // On mount, load the history list for the resource
    useEffect(async () => {
        // Get the ID from the params and send an error if not defined
        const queryId = getParams('id');
        if (!queryId) {
            setComponents(<Loading error>No ID defined! Please return to the home page.</Loading>);
            return;
        }

        // Make the API call and handle errors
        const history = await getHistory(resource, queryId);
        if (history.status !== 200) {
            setComponents(
                <Loading error>Invalid {resource} ID. Please return to the home page and check the ID.</Loading>
            );
            return;
        }

        // Set the history list and club name state variables
        setHistoryList(history.data.history.sort((a, b) => b.time - a.time));
        setName(history.data.name);
    }, []);

    // When the history list is updated, create the table rows (edit history entries)
    useEffect(async () => {
        // If the history list is not defined, return
        if (historyList === null) return;

        // Create the table rows and set the component list to the state variable
        // We use Promise.all here because the parseEditor api call is asynchronous
        // The Promise.all function will resolve the map of promises to actual values before setting the state
        setComponents(
            await Promise.all(
                historyList.map(async (history, i) => (
                    <TableRow
                        onClick={openPopup.bind(this, i)}
                        key={i}
                        sx={{
                            transition: '0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: (theme) =>
                                    darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
                            },
                        }}
                    >
                        <TableCell>{calculateEditDate(history.time)}</TableCell>
                        <TableCell>
                            {i === historyList.length - 1
                                ? 'Resource created'
                                : `${history.fields.length} fields were updated`}
                        </TableCell>
                        <TableCell>{await parseEditor(history.editor)}</TableCell>
                    </TableRow>
                ))
            )
        );
    }, [historyList]);

    // Opens the popup for a single edit when clicked
    const openPopup = (index) => {
        setCurrHistory(index);
        setPopupOpen(true);
    };

    // Returns the user to the pervious page
    // If the user was on the edit page, return them there, or else return them to the edit page for the resource
    const back = () => {
        const view = getParams('view');
        if (view) redirect('/edit');
        else redirect('/edit' + location.pathname.split('/edit/history')[1] + location.search);
    };

    return (
        <TableContainer>
            {components === null ? (
                <Loading />
            ) : (
                <React.Fragment>
                    <Title editHistory resource={resource} name={name} />
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
