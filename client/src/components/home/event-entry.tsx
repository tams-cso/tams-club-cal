import React from 'react';
import type { Theme } from '@mui/material';
import { eventTypeToString, locationToString } from '../../util/miscUtil';
import { formatEventTime } from '../../util/datetime';
import { darkSwitch } from '../../util/cssUtil';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Link from '../shared/Link';
import StyledSpan from '../shared/styled-span';

interface EventEntryProps {
    /** The event object to display */
    event: CalEvent;
}

/**
 * An event entry on the home page events list
 */
const EventEntry = ({ event }: EventEntryProps) => {
    const location = locationToString(event.location);
    return (
        <ListItem
            button
            sx={{
                overflowX: 'hidden',
                padding: 0,
            }}
            key={event.id}
        >
            <Link
                href={`/events/${event.id}`}
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
                    {`${formatEventTime(event)}`}
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
                        {event.name}
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
                            {event.club}
                        </StyledSpan>
                        {`  ·  ${eventTypeToString(event.type)}` +
                            (location ? ` | ${location}` : '') +
                            (event.description ? '  ·  ' + event.description.replace(/\n/g, ' | ') : '')}
                    </Typography>
                </Box>
            </Link>
        </ListItem>
    );
};

export default EventEntry;
