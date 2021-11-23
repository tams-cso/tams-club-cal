import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import Button from '@mui/material/Button';
import { getBackendUrl } from '../../../functions/api';

const useStyles = makeStyles({
    root: {
        padding: 4,
        display: (props) => (props.hidden ? 'none' : 'block'),
    },
    hidden: {
        display: 'none',
    },
});

/**
 * Displays the "Sign in with Google" button
 *
 * @param {object} props React props object
 * @param {boolean} props.disabled True if the button is disabled
 * @param {boolean} props.hidden True if you want the button to be hidden
 */
const GoogleLoginButton = (props) => {
    const classes = useStyles({ hidden: props.hidden });
    const backend = `${getBackendUrl()}/auth/login`;
    return (
        <React.Fragment>
            <div
                id="g_id_onload"
                data-client_id="629507270355-bgs4cj26r91979g5of4ko4j8opd2jsvk.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="redirect"
                data-login_uri={backend}
                data-auto_prompt="false"
            ></div>
            <Button
                disabled={props.disabled || false}
                className={`g_id_signin ${classes.root}`}
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_blue"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
            ></Button>
        </React.Fragment>
    );
};

export default GoogleLoginButton;
