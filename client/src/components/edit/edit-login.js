import { Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getIp, getLoggedIn, getUserInfo } from '../../functions/api';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { darkSwitchGrey } from '../../functions/util';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    editText: {
        color: theme.palette.secondary.main,
        [theme.breakpoints.down('sm')]: {
            marginBottom: 12,
        },
    },
    signInButton: {
        padding: 4,
    },
    message: {
        paddingBottom: 24,
        paddingRight: 24,
        textAlign: 'right',
        color: darkSwitchGrey(theme),
    },
}));

const EditLogin = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const classes = useStyles();
    const [loginButton, setLoginButton] = useState(
        <Button
            disabled={!loading}
            className={`g_id_signin ${classes.signInButton}`}
            data-type="standard"
            data-shape="rectangular"
            data-theme="filled_blue"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
        ></Button>
    );
    const [logoutButton, setLogoutButton] = useState(null);

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
                setLoginButton(null);
                setLogoutButton(
                    <Button variant="contained" color="primary" onClick={logout}>
                        Log out
                    </Button>
                );
                setMessage(`You are logged in as ${userRes.data.name}!`);
                setLoading(false);
                return;
            }
        }
        const ip = await getIp();
        setMessage(`Edits will be made under your ip address [${ip.data.ip}].`);
        setLoading(false);
    }, []);

    return (
        <React.Fragment>
            <Box className={classes.root}>
                <Typography variant="h3" className={classes.editText}>
                    EDIT MODE
                </Typography>
                <div
                    id="g_id_onload"
                    data-client_id="629507270355-bgs4cj26r91979g5of4ko4j8opd2jsvk.apps.googleusercontent.com"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-login_uri="http://localhost:5000/auth/login"
                ></div>
                {loginButton}
                {logoutButton}
            </Box>
            <Typography className={classes.message}>{message}</Typography>
        </React.Fragment>
    );
};

export default EditLogin;
