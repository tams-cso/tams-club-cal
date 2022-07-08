import React, { useEffect, useState } from 'react';
import { createConnectionErrorPopup } from '../../../util/constructors';
import { darkSwitch, darkSwitchGrey } from '../../../util/cssUtil';
import { getUserInfo } from '../../../api';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popup from '../../shared/popup';
import { getCookie } from '../../../util/cookies';

/**
 * Display a login message at the top of edit pages telling
 * the user whether or not they are logged in. Additionally, this
 * will feature a login/logout button.
 */
const EditLogin = () => {
    const [message, setMessage] = useState(null);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);

    // When component mounts and the user opens any edit page, check if they are logged in
    useEffect(() => {
        (async () => {
            const tokenCookie = getCookie('token');

            // Check if token defined
            if (!tokenCookie) {
                setMessage('You are not logged in');
                return;
            }

            // Get user information and return not valid token
            const userRes = await getUserInfo(tokenCookie['token']);
            if (userRes.status === 401) {
                setMessage('You are not logged in');
                return;
            } else if (userRes.status !== 200) {
                setPopupEvent(createConnectionErrorPopup());
                return;
            }

            // If all is good, display the logged in message!
            setMessage(`You are logged in as ${userRes.data.name}!`);
        })();
    }, []);

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
                <Typography
                    sx={{
                        color: (theme) => darkSwitchGrey(theme),
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </React.Fragment>
    );
};

export default EditLogin;
