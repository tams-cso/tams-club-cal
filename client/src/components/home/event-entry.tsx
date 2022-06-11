import React from 'react';
import type { Theme } from '@mui/material';
import { Event } from '../../types';
import { darkSwitch, formatEventTime } from '../../util';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from '../shared/Link';
import StyledSpan from '../shared/styled-span';

interface EventEntryProps {
    /** The event object to display */
    event: Event;
}

/**
 * An event entry on the home page events list
 */
const EventEntry = (props: EventEntryProps) => {
    // Replace all the newlines in the description with a pipe
    const description = props.event.description.replace(/\n/g, ' | ');

    return (
        <ListItem
            button
            sx={{
                overflowX: 'hidden',
                padding: 0,
            }}
        >
            <Link
                href={`/events/${props.event.id}`}
                sx={{
                    width: '100%',
                    padding: { lg: 2, xs: '8px 0' },
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    textDecoration: 'none',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        width: { lg: 200, xs: 80 },
                        flexShrink: 0,
                        textAlign: 'left',
                        fontSize: { lg: '1.2rem', xs: '0.9rem' },
                    }}
                >
                    {`${formatEventTime(props.event)}`}
                </Typography>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                        variant="h3"
                        component="p"
                        sx={{
                            color: (theme) => darkSwitch(theme, theme.palette.common.black, theme.palette.grey[200]),
                            fontSize: { lg: '1.25rem', xs: '1rem' },
                        }}
                    >
                        {props.event.name}
                    </Typography>
                    <Typography
                        sx={{
                            marginTop: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { lg: '0.85rem', xs: '0.75rem' },
                            color: (theme) => theme.palette.grey[600],
                        }}
                    >
                        <StyledSpan
                            sx={{
                                color: (theme: Theme) =>
                                    darkSwitch(theme, theme.palette.common.black, theme.palette.grey[400]),
                            }}
                        >
                            {props.event.club}
                        </StyledSpan>
                        {props.event.description ? ` - ${description}` : ''}
                    </Typography>
                </Box>
            </Link>
        </ListItem>
    );
};

export default EventEntry;
