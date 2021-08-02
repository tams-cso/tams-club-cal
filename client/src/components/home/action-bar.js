import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { capitalize, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { getParams } from '../../functions/util';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';

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
 * and other utility buttons, passed in as children.
 *
 * @param {object} props React props object
 * @param {*} props.children React children
 * @param {string} props.view View state variable
 * @param {Function} props.setView View state setter function
 */
const ActionBar = (props) => {
    const location = useLocation();
    const history = useHistory();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyles();

    const handleView = (event, newView) => {
        if (newView !== null) {
            props.setView(newView);
            history.push(`${location.pathname}?view=${newView}`);
        }
    };

    useEffect(() => {
        const searchView = getParams('view');
        if (searchView === 'calendar') props.setView('calendar');
        else if (searchView === 'reservation') props.setView('reservation');
    }, []);

    return (
        <Paper className={classes.root}>
            <Toolbar>
                <Typography variant="h3" className={classes.spacerRight}>
                    {`${capitalize(props.view || '')}${matches ? ' View' : ''}`}
                </Typography>
                <Box>{props.children}</Box>
                <ToggleButtonGroup
                    value={props.view}
                    exclusive
                    onChange={handleView}
                    aria-label="switch view"
                    className={classes.buttonGroup}
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
