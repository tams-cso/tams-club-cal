import React from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import dayjs from 'dayjs';

import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';

interface DateTimeInputProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;
    
    /** Name of the field */
    name: string
    
    /** Label of the field */
    label: string
    
    /** Is this field required */
    required?: boolean
    
    /** True if ending time, which means I will have to add 1 hour */
    end?: boolean
    
    /** True will disable the input */
    disabled?: boolean
    
    /** Default starting time value */
    value?: number
    
    /** Format the DatePicker TextField */
    sx?: object
}

/**
 * Displays a controlled date time input
 */
const DateTimeInput = (props: DateTimeInputProps) => {
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
            render={({ field: { onChange, value } }) => (
                <DateTimePicker
                    label={props.label}
                    value={value}
                    onChange={onChange}
                    disabled={props.disabled}
                    renderInput={(params) => <TextField {...params} sx={props.sx} />}
                />
            )}
        />
    );
};

export default DateTimeInput;
