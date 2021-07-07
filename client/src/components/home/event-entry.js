import React from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { Event } from '../../functions/entries';
import { darkSwitch, formatTime } from '../../functions/util';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden',
        padding: 0,
    },
    wrapper: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textDecoration: 'none',
    },
    rightBox: {
        overflow: 'hidden',
    },
    time: {
        flexShrink: 0,
        width: '16rem',
        textAlign: 'center',
    },
    name: {
        color: darkSwitch(theme, theme.palette.common.black, theme.palette.grey[200]),
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.85rem',
        color: theme.palette.grey[600],
    },
}));

/**
 * An event entry on the home page events list
 *
 * @param {object} props The react properties
 * @param {Event} props.event The events object
 */
const EventEntry = (props) => {
    // Format the starting date/time
    let formattedDateTime = formatTime(props.event.start, 'h:mma');
    if (props.event.type === 'event') formattedDateTime += formatTime(props.event.end, ' - h:mma');

    // Replace all the newlines in the description with a pipe
    const displayDescription = props.event.description.replace(/\n/g, ' | ');

    const classes = useStyles();
    return (
        <ListItem button className={classes.root}>
            <NavLink to={`/events?${props.event.id}`} className={classes.wrapper}>
                <Typography variant="h4" className={classes.time}>
                    {formattedDateTime}
                </Typography>
                <Box className={classes.rightBox}>
                    <Typography variant="h3" component="p" className={classes.name}>
                        {props.event.name}
                    </Typography>
                    <Typography
                        className={classes.description}
                    >{`${props.event.club} - ${displayDescription}`}</Typography>
                </Box>
            </NavLink>
        </ListItem>
    );
};

export default EventEntry;
