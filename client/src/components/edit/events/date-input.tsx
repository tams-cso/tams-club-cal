import React from 'react';
import type { Control, FieldValues, Validate } from 'react-hook-form';
import dayjs from 'dayjs';

import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';

interface DateInputProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** Name of the field */
    name: string;

    /** Label of the field */
    label: string;

    /** Is this field required */
    required?: boolean;

    /** Pass custom validation function to controller */
    validate?: Validate<any> | Record<string, Validate<any>>;

    /** Error message to display in the case of an error; required if 'required' defined */
    errorMessage?: string;

    /** If defined, will show helper text */
    helperText?: string;

    /** True if ending time, which means I will have to add 1 hour */
    end?: boolean;

    /** True will disable the input */
    disabled?: boolean;

    /** Default starting time value */
    value?: number;

    /** Format the DatePicker TextField */
    sx?: object;
}

/**
 * Displays a controlled date input
 */
const DateInput = (props: DateInputProps) => {
    return (
        <Controller
            control={props.control}
            rules={{ required: props.required || false, validate: props.validate }}
            name={props.name}
            defaultValue={props.value ? dayjs(Number(props.value)) : dayjs().add(1, 'week')}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <DatePicker
                    label={props.label}
                    value={value}
                    onChange={onChange}
                    disabled={props.disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={props.sx}
                            error={error ? true : false}
                            helperText={error ? props.errorMessage : props.helperText}
                            onBlur={onBlur}
                        />
                    )}
                />
            )}
        />
    );
};

export default DateInput;
