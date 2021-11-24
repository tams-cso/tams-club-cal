import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { capitalize, useMediaQuery, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { getParams } from '../../functions/util';

import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';

const useStyles = makeStyles({
    root: {
        marginBottom: 12,
        marginLeft: 16,
        marginRight: 12,
    },
    buttonGroup: {
        paddingLeft: 'auto',
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    spacerRight: {
        marginRight: 16,
    },
});

/**
 * Displays an action bar for the home page for switching between views
 * and other utility buttons, passed in as props.
 * This relies on the props.view state object to be pased in
 * from the home page, as well as its setter function.
 *
 * @param {object} props React props object
 * @param {*} [props.children] React children
 * @param {string} props.view View state variable
 * @param {Function} props.setView View state setter function
 */
const ActionBar = (props) => {
    const location = useLocation();
    const history = useHistory();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyles();

    // If there is a specified view in the URL params, use that
    // otherwise, the view will be set to the default (schedule)
    useEffect(() => {
        const searchView = getParams('view');
        if (searchView === 'calendar') props.setView('calendar');
        else if (searchView === 'reservation') props.setView('reservation');
    }, []);

    // If the user clicks on a new view, update the state variable and url
    const handleView = (event, newView) => {
        if (newView !== null) {
            props.setView(newView);
            history.push(`${location.pathname}?view=${newView}`);
        }
    };

    return (
        <Paper
            sx={{
                marginBottom: 3,
                marginLeft: 3,
                marginRight: 2,
            }}
        >
            <Toolbar>
                <Typography variant="h3" sx={{ marginRight: 4 }}>
                    {`${capitalize(props.view || '')}${matches ? ' View' : ''}`}
                </Typography>
                <Box>{props.children}</Box>
                <ToggleButtonGroup
                    value={props.view}
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
                    <ToggleButton value="reservation">
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
