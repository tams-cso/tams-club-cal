import React from 'react';
import type { Theme } from '@mui/material';
import dayjs from 'dayjs';
import { formatEventTime } from '../../util/datetime';
import { darkSwitch, darkSwitchGrey } from '../../util/cssUtil';

import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from '../shared/Link';

interface CalendarEventProps {
    /** Event object to display */
    event: CalEvent;
}

/**
 * Displays a single event in the calendar view
 */
const CalendarEvent = (props: CalendarEventProps) => {
    // Format the current date for url
    const urlDate = dayjs(props.event.start).format('/YYYY/MM/DD');

    return (
        <ListItem sx={{ overflow: 'hidden', padding: 0 }}>
            <Link
                href={`/events/${props.event.id}?view=calendar${urlDate}`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
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
                            darkSwitch(theme, theme.palette.grey[300], theme.palette.grey[700]),
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
            </Link>
        </ListItem>
    );
};

export default CalendarEvent;
