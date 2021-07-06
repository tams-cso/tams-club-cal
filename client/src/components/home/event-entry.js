import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { Event } from '../../functions/entries';
import { formatTime } from '../../functions/util';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden',
        paddingTop: '1rem',
        paddingBottom: '1rem',
    },
    rightBox: {
        overflow: 'hidden',
    },
    time: {
        flexShrink: 0,
        width: '16rem',
        textAlign: 'center',
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
            <Typography variant="h4" className={classes.time}>
                {formattedDateTime}
            </Typography>
            <Box className={classes.rightBox}>
                <Typography variant="h3" component="p">
                    {props.event.name}
                </Typography>
                <Typography className={classes.description}>{`${props.event.club} - ${displayDescription}`}</Typography>
            </Box>
        </ListItem>
    );
};

export default EventEntry;
