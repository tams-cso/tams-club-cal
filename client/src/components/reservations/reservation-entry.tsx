import React from 'react';
import { alpha, Tooltip } from '@mui/material';
import { formatTime } from '../../util/datetime';
import { darkSwitch } from '../../util/cssUtil';
import type { BrokenReservation, Room } from '../../types';

import Box from '@mui/material/Box';
import Link from '../shared/Link';

interface ReservationEntryProps {
    /** Broken reservation entry */
    res: BrokenReservation;

    /** Style the TableCell component */
    sx?: object;

    /** If from the room page, include room object */
    room?: Room;
}

/**
 * Displays a reservation in the grid. This will be a certain width and
 * be offset from the left side based on the starting hour and duration.
 */
const ReservationEntry = (props: ReservationEntryProps) => {
    // Calculate the offset (percentage of table width)
    const hourStart = props.res.start.hour();
    const minuteStart = props.res.start.minute();
    const leftOffset = 10 + (hourStart - 6) * 5 + (5 * minuteStart) / 60;

    // Calculate the width
    const diffHour = props.res.end.diff(props.res.start, 'hour');
    const diffMinute = props.res.end.diff(props.res.end, 'minute');
    const width = diffHour * 5 + (5 * diffMinute) / 60;

    // Format the tooltip title
    const startFormatted = formatTime(props.res.start.valueOf(), 'h:mma', true);
    const endFormatted = formatTime(props.res.end.valueOf(), 'h:mma', true);
    const tooltipTitle = `${props.res.data.name} (${startFormatted} - ${endFormatted})`;

    // Format the current date for url and add room if defined
    const urlDate = props.res.start.format('/YYYY/MM/DD');
    const fullUrl = props.room ? `/room/${props.room.value}/${urlDate}` : urlDate;

    return (
        <Box
            sx={{ position: 'absolute', ...props.sx, left: `${leftOffset}%`, width: `${width}%`, alignSelf: 'center' }}
        >
            <Tooltip title={tooltipTitle}>
                <Link
                    href={`/events/${props.res.data.id}?view=reservations${fullUrl}`}
                    sx={{
                        display: 'block',
                        fontSize: '0.75rem',
                        paddingLeft: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        backgroundColor: (theme) =>
                            alpha(darkSwitch(theme, theme.palette.primary.light, theme.palette.primary.dark), 0.5),
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {props.res.data.name}
                </Link>
            </Tooltip>
        </Box>
    );
};

export default ReservationEntry;
