import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Cookies from 'universal-cookie';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PageWrapper from '../shared/page-wrapper';
import EditLogin from './edit-login';
import EditEvents from './edit-events';
import EditHistory from './edit-history';

const useStyles = makeStyles({
    root: {
        flexDirection: 'column',
    },
    error: {
        textAlign: 'center',
        paddingBottom: 12,
    },
});

const Edit = () => {
    const classes = useStyles();
    const location = useLocation();

    // Save current path in a cookie in case the user wants to log in
    useEffect(() => {
        const cookies = new Cookies();
        cookies.set('prev', `${location.pathname}${location.search}`, { sameSite: 'strict', path: '/' });
    }, [location]);

    return (
        <PageWrapper className={classes.root}>
            <Container>
                <Paper>
                    <EditLogin />
                    <BrowserRouter>
                        <Switch>
                            <Route path="/edit/events" component={EditEvents} />
                            {/* <Route path="/edit/clubs" component={EditClubs} /> */}
                            {/* <Route path="/edit/volunteering" component={EditVolunteering} /> */}
                            <Route path="/edit/history/:resource" component={EditHistory} />
                            <Route>
                                <Typography variant="h1" className={classes.error}>
                                    ERROR: Invalid editing URL :(
                                </Typography>
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default Edit;
