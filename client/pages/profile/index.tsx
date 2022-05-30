import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Cookies from 'universal-cookie';
import { getBackendUrl, getAuthInfo } from '../../src/api';
import { darkSwitchGrey } from '../../src/util';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PageWrapper from '../../src/components/shared/page-wrapper';
import TitleMeta from '../../src/components/meta/title-meta';

// Server-side Rendering to check for token
// TODO: This block can be cleaned up
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const token = ctx.req.cookies.token;
    if (token === undefined) return { props: { authorized: false } };

    // Check if valid token and compare with database
    const res = await getAuthInfo(token);
    if (res.status === 200 && res.data.loggedIn) {
        return { props: { authorized: true } };
    } else {
        return { props: { authorized: false, error: res.status !== 200 } };
    }
};

/**
 * The main login screen for the profile page. This will display the Login with Google button.
 * If the user has already logged in, they will be redirected to the dashboard or to the edit page they were on before.
 * This redirection will, by default, be to the dashboard. However, if a path is passed in through the querystring, then
 * the user will be redirected to the specified path.
 */
const Login = ({ authorized, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const cookies = new Cookies();
    const [loadScreen, setLoadScreen] = useState(true); // TODO: What is this

    // Gets backend URL, which is determined by the environmental variables
    const backend = `${getBackendUrl()}/auth/login`;

    // Redirect user if they are logged in
    useEffect(() => {
        if (authorized) router.push('/profile/dashboard');
    });

    // Reload the page to create the login button component
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
        <PageWrapper>
            <TitleMeta title="Login" path="/profile" />
            <Card sx={{ maxWidth: 500, mx: 'auto', height: 'max-content' }}>
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
                        {error
                            ? 'Error getting login page! Please check your internet and try again!'
                            : 'You can securely login with Google to track your edits across this site. You may edit resources without logging in, but edits will be made under your IP address instead.'}
                    </Typography>
                </CardContent>
            </Card>
        </PageWrapper>
    );
};

export default Login;
