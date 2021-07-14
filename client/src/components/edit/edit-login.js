import { Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getIp, getLoggedIn, getUserInfo } from '../../functions/api';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { darkSwitchGrey } from '../../functions/util';
import GoogleLoginButton from './google-login-button';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            padding: 16,
            flexDirection: 'column',
        },
    },
    editText: {
        color: theme.palette.secondary.main,
        [theme.breakpoints.down('sm')]: {
            marginBottom: 12,
            alignSelf: 'flex-start',
        },
    },
    message: {
        paddingBottom: 24,
        paddingRight: 24,
        textAlign: 'right',
        color: darkSwitchGrey(theme),
        [theme.breakpoints.down('sm')]: {
            paddingRight: 0,
            textAlign: 'center'
        },
    },
    hidden: {
        display: 'none',
    },
}));

const EditLogin = () => {
    const [message, setMessage] = useState(null);
    const classes = useStyles();
    const [showLogin, setShowLogin] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const logout = () => {
        // Remove token and refresh
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        history.go(0);
    };

    useEffect(async () => {
        const cookies = new Cookies();
        const token = cookies.get('token');

        // Check if valid token and compare with database
        if (token !== undefined) {
            const res = await getLoggedIn(token);
            if (res.status === 200 && res.data.loggedIn) {
                // If all is good, display the logged in prompt!
                const userRes = await getUserInfo(token);
                setShowLogout(true);
                setMessage(`You are logged in as ${userRes.data.name}!`);
                return;
            }
        }
        const ip = await getIp();
        setMessage(`Edits will be made under your ip address [${ip.data.ip}].`);
        setShowLogin(true);
    }, []);

    return (
        <React.Fragment>
            <Box className={classes.root}>
                <Typography variant="h3" className={classes.editText}>
                    EDIT MODE
                </Typography>
                <GoogleLoginButton hidden={!showLogin} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={logout}
                    className={showLogout ? '' : classes.hidden}
                >
                    Log out
                </Button>
            </Box>
            <Typography className={classes.message}>{message}</Typography>
        </React.Fragment>
    );
};

export default EditLogin;
