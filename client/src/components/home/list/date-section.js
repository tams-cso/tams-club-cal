import React from 'react';
import { alpha } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch, formatTime } from '../../../functions/util';

import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        color: darkSwitch(theme, theme.palette.grey[800], alpha(theme.palette.primary.light, 0.9)),
    },
}));

/**
 * Displays a date heading
 *
 * @param {object} props React props object
 * @param {string} props.time Starting time of the first event of the day
 */
const DateSection = (props) => {
    const classes = useStyles();
    return (
        <Typography variant="h6" component="h2" className={classes.root}>
            {formatTime(props.time, 'dddd M/D/YYYY')}
        </Typography>
    );
};

export default DateSection;
