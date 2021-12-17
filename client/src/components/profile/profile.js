import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { getLoggedIn } from '../../functions/api';
import { redirect } from '../../functions/util';
import Cookies from 'universal-cookie';

import Container from '@mui/material/Container';
import Login from './login';
import Dashboard from './dashboard';
import Admin from './admin';
import Loading from '../shared/loading';
import PageWrapper from '../shared/page-wrapper';

/**
 * Profile page router.
 * By default, the profile page will direct the user to the login page.
 * If the user is found to be logged in, the profile page will direct the user to the dashboard.
 * If the user is an admin, there will be a button on the dashboard to redirect the user to the admin page.
 */
const Profile = () => {
    const [isLoaded, setLoaded] = useState(false);
    const history = useHistory();
    const cookies = new Cookies();

    // Check if the user is logged in and set path to login page if not
    useEffect(async () => {
        // Check if valid token and compare with database
        // If everything is good, don't do anything and render the router
        // TODO: This is duplicate with /client/src/components/edit/edit-login.js
        const token = cookies.get('token');
        if (token !== undefined) {
            const res = await getLoggedIn(token);
            if (res.status === 200 && res.data.loggedIn) {
                // Redirect user to dashboard if not at the admin dashboard
                // and cleanup cookies if logged in already
                if (window.location.pathname !== '/profile/admin') history.push('/profile/dashboard');
                cookies.remove('login_button_creation_check');
                setLoaded(true);
                return;
            }
        }

        // If the user is already on the login page, do nothing
        if (window.location.pathname === '/profile') {
            setLoaded(true);
            return;
        }

        // If the user is not logged in, redirect them to the login page
        cookies.set('login_button_creation_check', true, { path: '/' });
        redirect('/profile');
    }, []);
    return (
        <PageWrapper title="Profile">
            <Container>
                {isLoaded ? (
                    <BrowserRouter>
                        <Switch>
                            <Route path="/profile/dashboard" component={Dashboard} />
                            <Route path="/profile/admin" component={Admin} />
                            <Route exact path="/profile" component={Login} />
                        </Switch>
                    </BrowserRouter>
                ) : (
                    <Loading />
                )}
            </Container>
        </PageWrapper>
    );
};

export default Profile;
