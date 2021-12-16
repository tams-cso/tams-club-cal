import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getBackendUrl } from '../../functions/api';
import { darkSwitchGrey } from '../../functions/util';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Loading from '../shared/loading';

/**
 * The main login screen for the profile page. This will display the Login with Google button.
 * If the user has already logged in, they will be redirected to the dashboard or to the edit page they were on before.
 * This redirection will, by default, be to the dashboard. However, if a path is passed in through the querystring, then
 * the user will be redirected to the specified path.
 */
const Login = () => {
    const cookies = new Cookies();
    const [loadScreen, setLoadScreen] = useState(true);

    // Gets backend URL, which is determined by the environmental variables
    const backend = `${getBackendUrl()}/auth/login`;

    // Redirect the page to create the login button component
    // This will use a cookie to determine if the page has been refreshed for the first time
    // This is due to the Google login limitation of rendering the button on page load,
    // which can only be done with a page refresh after routing
    useEffect(() => {
        const created = cookies.get('login_button_creation_check');
        if (created) {
            cookies.remove('login_button_creation_check');
            setLoadScreen(false);
            return;
        }
        cookies.set('login_button_creation_check', true, { path: '/' });
        window.location.reload();
    }, []);

    return (
        <React.Fragment>
            <Loading sx={{ display: loadScreen ? 'block' : 'none' }} />
            <Card sx={{ maxWidth: 500, margin: 'auto', display: !loadScreen ? 'block' : 'none' }}>
                <CardContent>
                    <Typography variant="h2" component="h1" sx={{ textAlign: 'center' }}>
                        Login
                    </Typography>
                    <Box sx={{ justifyContent: 'center', display: 'flex', marginTop: 3, marginBottom: 3 }}>
                        <div
                            id="g_id_onload"
                            data-client_id="629507270355-bgs4cj26r91979g5of4ko4j8opd2jsvk.apps.googleusercontent.com"
                            data-context="signin"
                            data-ux_mode="redirect"
                            data-login_uri={backend}
                            data-auto_prompt="false"
                        ></div>
                        <Button
                            className="g_id_signin"
                            data-type="standard"
                            data-shape="rectangular"
                            data-theme="filled_blue"
                            data-text="signin_with"
                            data-size="large"
                            data-logo_alignment="left"
                            sx={{ padding: 1 }}
                        ></Button>
                    </Box>
                    <Typography sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                        You can securely login with Google to track your edits across this site. You may edit resources
                        without logging in, but edits will be made under your IP address instead.
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default Login;
