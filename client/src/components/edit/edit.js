import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { redirect } from '../../functions/util';
import Cookies from 'universal-cookie';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PageWrapper from '../shared/page-wrapper';
import EditLogin from './edit-login';
import EditEvents from './edit-events';
import EditClubs from './edit-clubs';
import EditVolunteering from './edit-volunteering';
import EditReservations from './edit-reservations';
import HistoryDisplay from './history/history-display';
import HistoryList from './history/history-list';

const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
    },
    paper: {
        paddingBottom: 12,
        marginBottom: 24,
    },
    centerBox: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    button: {
        margin: 12,
    },
}));

const Edit = () => {
    const classes = useStyles();
    const location = useLocation();

    // Save current path in a cookie in case the user wants to log in
    useEffect(() => {
        const cookies = new Cookies();
        cookies.set('prev', `${location.pathname}${location.search}`, { sameSite: 'strict', path: '/' });
    }, [location]);

    const add = (resource) => redirect(`/edit/${resource}`);

    return (
        <PageWrapper title="Edit Resources" className={classes.root}>
            <Container>
                <Paper sx={{ paddingBottom: 3, marginBottom: 4 }}>
                    <EditLogin />
                    <BrowserRouter>
                        <Switch>
                            <Route path="/edit/events" component={EditEvents} />
                            <Route path="/edit/clubs" component={EditClubs} />
                            <Route path="/edit/volunteering" component={EditVolunteering} />
                            <Route path="/edit/reservations" component={EditReservations} />
                            <Route path="/edit/history/:resource" component={HistoryDisplay} />
                            <Route>
                                <Box className={classes.centerBox}>
                                    <Button
                                        variant="outlined"
                                        onClick={add.bind(this, 'events')}
                                        className={classes.button}
                                    >
                                        Add an Event
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={add.bind(this, 'clubs')}
                                        className={classes.button}
                                    >
                                        Add a Club
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={add.bind(this, 'volunteering')}
                                        className={classes.button}
                                    >
                                        Add a Volunteering Opportunity
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={add.bind(this, 'reservations')}
                                        className={classes.button}
                                    >
                                        Add a Reservation
                                    </Button>
                                </Box>
                                <HistoryList />
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default Edit;
