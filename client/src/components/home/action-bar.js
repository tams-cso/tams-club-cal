import React from 'react';
import { capitalize, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import EventNoteRoundedIcon from '@material-ui/icons/EventNoteRounded';
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded';

const useStyles = makeStyles((theme) => ({
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
}));

/**
 * Displays an action bar for the home page for switching between views
 * and other utility buttons, passed in as children.
 *
 * @param {object} props React props object
 * @param {*} props.children React children
 * @param {"schedule" | "calendar" | "reservation"} props.active Which view is active, shows the title for it as well.
 */
const ActionBar = (props) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Toolbar>
                <Typography variant="h3" className={classes.spacerRight}>
                    {`${capitalize(props.active)}${matches ? ' View' : ''}`}
                </Typography>
                <Box>{props.children}</Box>
                <ButtonGroup className={classes.buttonGroup}>
                    <Tooltip title="Schedule View">
                        <Button disabled={props.active === 'schedule'}>
                            <FormatListBulletedRoundedIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Calendar View">
                        <Button disabled={props.active === 'calendar'}>
                            <EventNoteRoundedIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Room Reservation Chart">
                        <Button disabled={props.active === 'reservation'}>
                            <MeetingRoomRoundedIcon />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Toolbar>
        </Paper>
    );
};

export default ActionBar;
