import React from 'react';
import { getBackendUrl } from '../../../functions/api';

import Button from '@mui/material/Button';

/**
 * Displays the "Sign in with Google" button.
 * This uses a script provided by the Google Auth API that is included
 * in the client/public/index.html file.
 * See https://developers.google.com/identity/gsi/web/guides/overview for more info.
 *
 * @param {object} props React props object
 * @param {boolean} [props.disabled] True if the button is disabled
 * @param {boolean} [props.hidden] True if you want the button to be hidden
 */
const GoogleLoginButton = (props) => {
    // Gets backend URL, which is determined by the environmental variables
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
                className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_blue"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
                sx={{ padding: 1, display: props.hidden ? 'none' : 'block' }}
            ></Button>
        </React.Fragment>
    );
};

export default GoogleLoginButton;
