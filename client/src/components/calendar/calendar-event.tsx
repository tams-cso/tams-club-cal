import React from 'react';
import type { Theme } from '@mui/material';
import { darkSwitch, darkSwitchGrey, formatEventTime } from '../../util';
import type { Event } from '../../types';

import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from '../shared/Link';

interface CalendarEventProps {
    /** Event object to display */
    activity: Event;

    /** True if you want the highlight color to be lighter */
    lighter?: boolean;
}

/**
 * Displays a single event in the calendar view
 */
const CalendarEvent = (props: CalendarEventProps) => {
    return (
        <ListItem sx={{ overflow: 'hidden', padding: 0 }}>
            <Link
                href={`/events/${props.activity.id}?view=calendar`}
                sx={{
                    width: '100%',
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: '0.2s',
                    '&:hover': {
                        backgroundColor: (theme: Theme) =>
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
                    {formatEventTime(props.activity, true)}
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
                    {props.activity.name}
                </Typography>
            </Link>
        </ListItem>
    );
};

export default CalendarEvent;
