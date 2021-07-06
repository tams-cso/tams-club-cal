import React from 'react';
import { Typography } from '@material-ui/core';
import { Event } from '../../functions/entries';
import { formatTime } from '../../functions/util';

/**
 * 
 * @param {object} props React props object
 * @param {string} props.time Starting time of the first event of the day
 */
const DateSection = (props) => {
    return (
        <Typography variant="h6" component="h2">
            {formatTime(props.time, 'dddd M/D/YYYY')}
        </Typography>
    );
};

export default DateSection;
