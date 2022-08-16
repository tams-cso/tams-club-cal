import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getUserInfo, postLogin } from '../../src/api';
import { createPopupEvent } from '../../src/util/constructors';
import { darkSwitchGrey } from '../../src/util/cssUtil';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoogleLogin from 'react-google-login';
import PageWrapper from '../../src/components/shared/page-wrapper';
import TitleMeta from '../../src/components/meta/title-meta';
import Popup from '../../src/components/shared/popup';
import UploadBackdrop from '../../src/components/edit/shared/upload-backdrop';
import { setCookie } from '../../src/util/cookies';
import { getParams } from '../../src/util/miscUtil';

// Server-side Rendering to check for token
// TODO: This block can be cleaned up
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get the token from cookies
    const token = ctx.req.cookies.token;
    if (token === undefined) return { props: { authorized: false, error: false } };

    // Check if valid token and compare with database
    const res = await getUserInfo(token);
    if (res.status === 200) {
        return { props: { authorized: true } };
    } else {
        return { props: { authorized: false, error: res.status !== 200 } };
    }
};

// Text to show on the login screen
// TODO: Move this to the data JSON file
const loginText =
    'You can securely login with Google to add and edit your own events across the site. All resources are publically avaliable for anyone to read. Clubs may have higher permissions to add and edit clubs and volunteering, but must be added by an existing admin.';

const CLIENT_ID = '629507270355-bgs4cj26r91979g5of4ko4j8opd2jsvk.apps.googleusercontent.com';

/**
 * The main login screen for the profile page. This will display the Login with Google button.
 * If the user has already logged in, they will be redirected to the dashboard or to the edit page they were on before.
 * This redirection will, by default, be to the dashboard. However, if a path is passed in through the querystring, then
 * the user will be redirected to the specified path.
 */
const Login = ({ authorized, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const [backdrop, setBackdrop] = useState(false);
    const router = useRouter();

    // On login success, send googleId and accessToken to the backend server
    // and do token exchange
    const responseGoogle = async (response) => {
        // Login backdrop
        setBackdrop(true);

        // Token exchange
        const token = await postLogin(response.tokenId);
        if (token.status !== 200) {
            setPopupEvent(createPopupEvent('Could not log in. Please check your connection and try again.', 4));
            return;
        }

        // Save token on frontend
        setCookie('token', token.data);

        // Remove backdrop
        setBackdrop(false);

        // Send user to dashboard or previous page
        const prev = getParams('prev');
        if (prev) {
            router.push(prev);
        } else {
            router.push('/profile/dashboard');
        }
    };

    const errorMessage = (response) => {
        setPopupEvent(createPopupEvent(`Could not log in: ${response.error}`, 3));
    };

    // Redirect user if they are logged in
    useEffect(() => {
        if (authorized) router.push('/profile/dashboard');
    }, []);

    return (
        <PageWrapper>
            <TitleMeta title="Login" path="/profile" />
            <Popup event={popupEvent} />
            <UploadBackdrop open={backdrop} text="Logging in..." />
            <Card sx={{ maxWidth: 500, mx: 'auto', height: 'max-content' }}>
                <CardContent>
                    <Typography variant="h2" component="h1" sx={{ textAlign: 'center' }}>
                        Login
                    </Typography>
                    <Box sx={{ justifyContent: 'center', display: 'flex', marginTop: 3, marginBottom: 3 }}>
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="Login with Google"
                            onSuccess={responseGoogle}
                            onFailure={errorMessage}
                            cookiePolicy={'single_host_origin'}
                            theme="dark"
                        ></GoogleLogin>
                    </Box>
                    <Typography sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                        {error ? 'Stale token detected. Please log in again to refresh the token.' : loginText}
                    </Typography>
                </CardContent>
            </Card>
        </PageWrapper>
    );
};

export default Login;
