import React from 'react';
import { formatTime } from '../../functions/util';

import Typography from '@material-ui/core/Typography';

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
