import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';
import Cookies from 'universal-cookie';
import { redirect } from '../../functions/util';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    button: {
        margin: 12,
    }
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
        <PageWrapper className={classes.root}>
            <Container>
                <Paper className={classes.paper}>
                    <Helmet>
                        <title>Edit Resources - TAMS Club Calendar</title>
                    </Helmet>
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
