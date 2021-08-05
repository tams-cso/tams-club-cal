import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Cookies from 'universal-cookie';
import { redirect } from '../../functions/util';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PageWrapper from '../shared/page-wrapper';
import EditLogin from './edit-login';
import EditEvents from './edit-events';
import EditClubs from './edit-clubs';
import EditVolunteering from './edit-volunteering';
import EditReservations from './edit-reservations';

const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
    },
    paper: {
        paddingBottom: 12,
    },
    error: {
        textAlign: 'center',
        paddingBottom: 12,
    },
    button: {
        display: 'block',
        margin: 'auto',
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

    const goHome = () => {
        redirect('/');
    };

    return (
        <PageWrapper className={classes.root}>
            <Container>
                <Paper className={classes.paper}>
                    <EditLogin />
                    <BrowserRouter>
                        <Switch>
                            <Route path="/edit/events" component={EditEvents} />
                            <Route path="/edit/clubs" component={EditClubs} />
                            <Route path="/edit/volunteering" component={EditVolunteering} />
                            <Route path="/edit/reservations" component={EditReservations} />
                            {/* <Route path="/edit/history/:resource" component={EditHistory} /> */}
                            <Route>
                                <Typography variant="h1" className={classes.error}>
                                    ERROR: Invalid editing URL :(
                                </Typography>
                                <Button variant="outlined" color="primary" className={classes.button} onClick={goHome}>
                                    Return to home page
                                </Button>
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default Edit;
