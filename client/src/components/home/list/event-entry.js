import React from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch, formatEventTime } from '../../../functions/util';
import { Event } from '../../../functions/entries';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden',
        padding: 0,
    },
    wrapper: {
        width: '100%',
        padding: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textDecoration: 'none',
        [theme.breakpoints.down('md')]: {
            padding: '8px 0',
        },
    },
    rightBox: {
        overflow: 'hidden',
    },
    time: {
        width: 200,
        flexShrink: 0,
        textAlign: 'left',
        [theme.breakpoints.down('md')]: {
            width: 80,
            fontSize: '0.9rem',
            textAlign: 'left',
        },
    },
    name: {
        color: darkSwitch(theme, theme.palette.common.black, theme.palette.grey[200]),
        [theme.breakpoints.down('md')]: {
            fontSize: '1rem',
        },
    },
    description: {
        marginTop: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.85rem',
        color: theme.palette.grey[600],
        [theme.breakpoints.down('md')]: {
            fontSize: '0.75rem',
        },
    },
    club: {
        color: darkSwitch(theme, theme.palette.common.black, theme.palette.grey[400]),
    }
}));

/**
 * An event entry on the home page events list
 *
 * @param {object} props The react properties
 * @param {Event} props.event The events object
 */
const EventEntry = (props) => {
    // Replace all the newlines in the description with a pipe
    const description = props.event.description.replace(/\n/g, ' | ');

    const classes = useStyles();
    return (
        <ListItem button className={classes.root}>
            <NavLink to={`/events?id=${props.event.id}`} className={classes.wrapper}>
                <Typography variant="h4" className={classes.time}>
                    {formatEventTime(props.event)}
                </Typography>
                <Box className={classes.rightBox}>
                    <Typography variant="h3" component="p" className={classes.name}>
                        {props.event.name}
                    </Typography>
                    <Typography className={classes.description}>
                        <span className={classes.club}>{props.event.club}</span>
                        {props.event.description ? ` - ${description}` : ''}
                    </Typography>
                </Box>
            </NavLink>
        </ListItem>
    );
};

export default EventEntry;
