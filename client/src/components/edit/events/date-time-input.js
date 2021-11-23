import dayjs from 'dayjs';
import React from 'react';

import { Controller } from 'react-hook-form';
import DateTimePicker from '@mui/lab/DateTimePicker';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EventIcon from '@mui/icons-material/Event';

/**
 * Displays a date time input
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
const DateTimeInput = (props) => {
    return (
        <Controller
            control={props.control}
            rules={{ required: props.required || false }}
            name={props.name}
            defaultValue={
                props.value
                    ? dayjs(Number(props.value))
                    : props.end
                    ? dayjs().startOf('hour').add(2, 'hour')
                    : dayjs().startOf('hour').add(1, 'hour')
            }
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <DateTimePicker
                    className={props.className}
                    inputVariant="outlined"
                    format="MMM D, YYYY  h:mm a"
                    label={props.label}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={error}
                    helperText={error ? 'End date/time should be after start' : props.helperText}
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

export default DateTimeInput;
