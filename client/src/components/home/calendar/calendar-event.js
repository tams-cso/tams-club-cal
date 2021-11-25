import React from 'react';
import { darkSwitch, darkSwitchGrey, formatEventTime } from '../../../functions/util';
import { Event } from '../../../functions/entries';

import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import NavLink from '../../shared/navlink';

/**
 * Displays a single event in the calendar view
 *
 * @param {object} props React props object
 * @param {Event} props.event Current event object
 * @param {boolean} [props.lighter] True if you want highlight color to be lighter
 */
const CalendarEvent = (props) => {
    return (
        <ListItem sx={{ overflow: 'hidden', padding: 0 }}>
            <NavLink
                to={`/events?id=${props.event.id}&view=calendar`}
                sx={{
                    width: '100%',
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: '0.2s',
                    '&:hover': {
                        backgroundColor: (theme) =>
                            props.lighter
                                ? darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700])
                                : darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[800]),
                    },
                }}
            >
                <Typography
                    sx={{
                        display: { lg: 'flex', xs: 'none' },
                        flexShrink: 0,
                        color: (theme) => darkSwitchGrey(theme),
                        fontSize: '0.65rem',
                    }}
                >
                    {formatEventTime(props.event, true)}
                </Typography>
                <Typography
                    sx={{
                        marginLeft: { lg: 2, xs: 0 },
                        overflow: 'hidden',
                        textOverflow: { lg: 'ellipsis', xs: 'clip' },
                        whiteSpace: 'nowrap',
                        flexShrink: 1,
                        fontSize: { lg: '0.85rem', xs: '0.65rem' },
                    }}
                >
                    {props.event.name}
                </Typography>
            </NavLink>
        </ListItem>
    );
};

export default CalendarEvent;
