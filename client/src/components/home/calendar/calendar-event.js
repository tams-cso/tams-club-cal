import React from 'react';
import { darkSwitch, darkSwitchGrey, formatEventTime } from '../../../functions/util';
import { Event } from '../../../functions/entries';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'hidden',
        padding: 0,
    },
    time: {
        color: darkSwitchGrey(theme),
        fontSize: '0.65rem',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    name: {
        marginLeft: 8,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexShrink: 1,
        fontSize: '0.85rem',
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            fontSize: '0.65rem',
            textOverflow: 'clip',
        },
    },
    linkWrapper: {
        width: '100%',
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        transition: '0.2s',
        '&:hover': {
            backgroundColor: (props) =>
                props.lighter
                    ? darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])
                    : darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[800]),
        },
    },
}));

/**
 * Displays a single event in the calendar view
 *
 * @param {object} props React props object
 * @param {Event} props.event Current event object
 * @param {boolean} [props.lighter] True if you want highlight color to be lighter
 */
const CalendarEvent = (props) => {
    const classes = useStyles({ lighter: props.lighter });
    return (
        <ListItem className={classes.root}>
            <Link to={`/events?id=${props.event.id}&view=calendar`} className={classes.linkWrapper}>
                <Typography className={classes.time}>{formatEventTime(props.event, true)}</Typography>
                <Typography className={classes.name}>{props.event.name}</Typography>
            </Link>
        </ListItem>
    );
};

export default CalendarEvent;
