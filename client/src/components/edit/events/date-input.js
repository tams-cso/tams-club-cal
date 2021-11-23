import dayjs from 'dayjs';
import React from 'react';

import { Controller } from 'react-hook-form';
import DatePicker from '@mui/lab/DatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event';

/**
 * Displays a date input
 * @param {object} props React props object
 * @param {*} props.control Form control object
 * @param {boolean} [props.required] Is this field required
 * @param {string} props.name Name of the field
 * @param {string} props.label Label of the field
 * @param {string} props.className Classname of the input object
 * @param {boolean} [props.end] True if ending time, which means I will have to add 1 hour
 * @param {boolean} [props.disabled] True will disable the input
 * @param {number} [props.value] Default starting time value
 * @param {string} [props.helperText] Default helper text to display; will be replaced by error
 */
const DateInput = (props) => {
    return (
        <Controller
            control={props.control}
            rules={{ required: props.required || false }}
            name={props.name}
            defaultValue={props.value ? dayjs(Number(props.value)) : dayjs().add(1, 'week')}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <DatePicker
                    className={props.className}
                    inputVariant="outlined"
                    format="MMM D, YYYY"
                    label={props.label}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={error}
                    helperText={error ? 'End date should be after start' : props.helperText}
                    disabled={props.disabled}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="large">
                                    <EventIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default DateInput;
