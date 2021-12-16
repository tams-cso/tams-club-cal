import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { darkSwitchGrey } from '../../functions/util';
import { getIp, getLoggedIn, getUserInfo } from '../../functions/api';
import { openConnectionErrorPopup } from '../../redux/actions';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EditLogin = () => {
    const [message, setMessage] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    // When component mounts and the user opens any edit page, check if they are logged in
    useEffect(async () => {
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
                } else dispatch(openConnectionErrorPopup());
                return;
            }
        }

        // Get the IP address of the user that will be displayed
        // if the user is not logged in; if this request errors show an error
        const ip = await getIp();
        if (ip.status === 200) {
            setMessage(`Edits will be made under your ip address [${ip.data.ip}].`);
        } else {
            dispatch(openConnectionErrorPopup());
        }
    }, []);

    // If the user clicks the logout button, log them out
    // by removing the token cookie and redirect them to previous page
    const onLogoutClick = () => {
        if (!showLogout) {
            history.push('/profile');
            return;
        }

        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        history.go(0);
    };

    return (
        <React.Fragment>
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
                        color: (theme) => theme.palette.secondary.main,
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
