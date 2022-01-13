import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';
import type { PopupEvent } from '../../../entries';
import { createConnectionErrorPopup, darkSwitch, darkSwitchGrey } from '../../../util';
import { getIp, getLoggedIn, getUserInfo } from '../../../api';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popup from '../../shared/popup';

/**
 * Display a login message at the top of edit pages telling
 * the user whether or not they are logged in. Additionally, this 
 * will feature a login/logout button.
 */
const EditLogin = () => {
    const [message, setMessage] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const router = useRouter();

    // When component mounts and the user opens any edit page, check if they are logged in
    useEffect(() => {
        (async () => {
            const cookies = new Cookies();
            const token = cookies.get('token');

            // Check if valid token and compare with database
            if (token !== undefined) {
                const res = await getLoggedIn(token);
                if (res.status === 200 && res.data.loggedIn) {
                    // If all is good, display the logged in prompt!
                    // However, if the username cannot be gotten, also show an error
                    const userRes = await getUserInfo(token);
                    if (userRes.status === 200) {
                        setShowLogout(true);
                        setMessage(`You are logged in as ${userRes.data.name}!`);
                    } else setPopupEvent(createConnectionErrorPopup());
                    return;
                }
            }

            // Get the IP address of the user that will be displayed
            // if the user is not logged in; if this request errors show an error
            const ip = await getIp();
            if (ip.status === 200) {
                setMessage(`Edits will be made under your ip address [${ip.data.ip}].`);
            } else {
                setPopupEvent(createConnectionErrorPopup());
            }
        })();
    }, []);

    // If the user clicks the logout button, log them out
    // by removing the token cookie and redirect them to previous page
    // If the user is instead wanting to login, redirect them to the login page
    const onLogoutClick = () => {
        // If user clicks login button
        // TODO: Make this make more sense in the code TT why login the same button name
        if (!showLogout) {
            router.push('/profile');
            return;
        }

        // If user clicks logout button
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        cookies.set('success', 'Successfully logged out!', { sameSite: 'strict', path: '/' });
        history.go(0);
    };

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            <Box
                sx={{
                    padding: { lg: '16px 24px', xs: 3 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { lg: 'row', xs: 'column' },
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        color: (theme) => darkSwitch(theme, theme.palette.secondary.dark, theme.palette.secondary.main),
                        marginBottom: { lg: 0, xs: 2 },
                        alignSelf: 'flex-start',
                    }}
                >
                    EDIT MODE
                </Typography>
                <Button variant="contained" color="primary" onClick={onLogoutClick}>
                    Log {showLogout ? 'out' : 'in'}
                </Button>
            </Box>
            <Typography
                sx={{
                    paddingBottom: 4,
                    paddingRight: { lg: 4, xs: 0 },
                    textAlign: { lg: 'right', xs: 'center' },
                    color: (theme) => darkSwitchGrey(theme),
                }}
            >
                {message}
            </Typography>
        </React.Fragment>
    );
};

export default EditLogin;
