import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { capitalize, useMediaQuery, useTheme } from '@mui/material';

import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

/**
 * Displays an action bar for the home page for switching between views.
 * The component will listen for changes to the route and display the "active" route accordingly.
 */
const ActionBar = () => {
    const router = useRouter();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const [path, setPath] = useState('schedule');

    // If the user clicks on a new view, update the state variable and url
    const handleView = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newPath: 'schedule' | 'calendar' | 'reservations'
    ) => {
        if (newPath !== null) router.push(newPath === 'schedule' ? '/' : `/events/${newPath}`);
    };

    // Get the current view from the pathname
    useEffect(() => {
        const view = router.pathname.includes('calendar')
            ? 'calendar'
            : router.pathname.includes('reservations')
            ? 'reservations'
            : 'schedule';
        setPath(view);
    }, []);

    return (
        <Paper
            sx={{
                marginBottom: 3,
                marginLeft: 3,
                marginRight: 2,
            }}
            elevation={4}
        >
            <Toolbar>
                <Typography variant="h3" sx={{ marginRight: 4 }}>
                    {`${capitalize(path || '')}${matches ? ' View' : ''}`}
                </Typography>
                <ToggleButtonGroup
                    value={path}
                    exclusive
                    onChange={handleView}
                    aria-label="switch view"
                    sx={{
                        paddingLeft: 'auto',
                        flexGrow: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    <ToggleButton value="schedule">
                        <Tooltip title="Schedule View">
                            <FormatListBulletedRoundedIcon />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="calendar">
                        <Tooltip title="Calendar View">
                            <EventNoteRoundedIcon />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="reservations">
                        <Tooltip title="Room Reservation Chart">
                            <MeetingRoomRoundedIcon />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Toolbar>
        </Paper>
    );
};

export default ActionBar;
