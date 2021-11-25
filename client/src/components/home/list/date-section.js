import React from 'react';
import { alpha } from '@mui/material';
import { darkSwitch, formatTime } from '../../../functions/util';

import Typography from '@mui/material/Typography';

/**
 * Displays a date heading, in the format dddd M/D/YYYY
 *
 * @param {object} props React props object
 * @param {string} props.time Starting time of the first event of the day
 */
const DateSection = (props) => {
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
