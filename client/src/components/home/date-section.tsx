import React from 'react';
import { alpha } from '@mui/material';
import { formatTime } from '../../util/datetime';
import { darkSwitch } from '../../util/cssUtil';

import Typography from '@mui/material/Typography';

interface DateSectionProps {
    /** Starting time of the first event of the day */
    time: number;
}

/**
 * Displays a date heading, in the format dddd M/D/YYYY.
 */
const DateSection = (props: DateSectionProps) => {
    return (
        <Typography
            variant="h6"
            component="h2"
            sx={{
                color: (theme) =>
                    darkSwitch(theme, theme.palette.primary.dark, alpha(theme.palette.primary.light, 0.9)),
            }}
        >
            {formatTime(props.time, 'dddd M/D/YYYY')}
        </Typography>
    );
};

export default DateSection;
