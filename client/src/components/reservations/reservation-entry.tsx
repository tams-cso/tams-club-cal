import React from 'react';
import { alpha, Tooltip } from '@mui/material';
import { formatTime } from '../../util/datetime';
import { darkSwitch } from '../../util/cssUtil';

import Box from '@mui/material/Box';
import Link from '../shared/Link';
import dayjs from 'dayjs';

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
    // Convert to dayjs
    const start = dayjs(props.res.start);
    const end = dayjs(props.res.end);

    // Calculate the offset (percentage of table width)
    const hourStart = start.hour();
    const minuteStart = start.minute();
    const leftOffset = 10.75 + (hourStart - 6) * 5.25 + (5.25 * minuteStart) / 60;

    // Calculate the width
    const diffMinute = end.diff(start, 'minute');
    const width = (5.25 * diffMinute) / 60;

    // Format the tooltip title
    const startFormatted = formatTime(start.valueOf(), 'h:mma', true);
    const endFormatted = formatTime(end.valueOf(), 'h:mma', true);
    const tooltipTitle = `${props.res.data.name} (${startFormatted} - ${endFormatted})`;

    // Format the current date for url and add room if defined
    const urlDate = start.format('/YYYY/MM/DD');
    const fullUrl = props.room ? `/room/${props.room.value}/${urlDate}` : urlDate;

    // Get the color
    const backgroundColor = (theme) =>
        props.res.data.publicEvent
            ? alpha(darkSwitch(theme, theme.palette.primary.light, theme.palette.primary.dark), 0.5)
            : alpha(darkSwitch(theme, theme.palette.secondary.main, theme.palette.secondary.dark), 0.5);

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
                        backgroundColor,
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
