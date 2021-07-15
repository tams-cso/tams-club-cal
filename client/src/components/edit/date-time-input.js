import dayjs from 'dayjs';
import React from 'react';

import { Controller } from 'react-hook-form';
import { DateTimePicker } from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';
/**
 * Displays a date time input
 * @param {object} props React props object
 * @param {*} props.control Form control object
 * @param {*} props.required Is this field required
 * @param {*} props.name Name of the field
 * @param {*} props.label Label of the field
 * @param {*} props.className Classname of the input object
 * @param {boolean} props.end True if ending time, which means I will have to add 1 hour
 * @returns
 */
const DateTimeInput = (props) => {
    return (
        <Controller
            control={props.control}
            rules={{ required: props.required || false }}
            name={props.name}
            defaultValue={props.end ? dayjs().add(1, 'hour') : dayjs()}
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
                    helperText={error ? 'End date/time should be after start' : ''}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
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
