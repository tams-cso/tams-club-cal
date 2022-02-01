import React, { useEffect } from 'react';
import type { Control, FieldValues, UseFormSetValue, Validate } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface ControlledTextFieldProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** Text field label */
    label: string;

    /** Name for the input */
    name: string;

    /** React hook form setValue function; required if value is defined */
    setValue?: UseFormSetValue<FieldValues>;

    /** Default value for the field */
    value?: string;

    /** Variant of the text field */
    variant?: 'standard' | 'outlined' | 'filled';

    /** True if a textarea; will give it multiline, show 4 rows, 100% width, and a 16px margin bottom */
    area?: boolean;

    /** If true, the element will have flex grow set to 1 */
    grow?: boolean;

    /** If true, the text box will expand to take up the width of the entire container */
    fullWidth?: boolean;

    /** If true, adds a margin of 12px below box */
    gutterBottom?: boolean;

    /** True if field is required */
    required?: boolean;

    /** Pass custom validation function to controller */
    validate?: Validate<any> | Record<string, Validate<any>>;

    /** Error message to display in the case of an error; required if 'required' defined */
    errorMessage?: string;

    /** If defined, will show helper text */
    helperText?: string;

    /** Format the TextField component */
    sx?: object;
}

/**
 * Displays a controlled text field to edit.
 * If required is true, then you must define the errors and errorMessage objects.
 */
const ControlledTextField = (props: ControlledTextFieldProps) => {
    // Set the default value of the field if it is defined
    useEffect(() => {
        if (!props.value) return;
        props.setValue(props.name, props.value);
    }, [props.value]);

    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={{ required: props.required || false, validate: props.validate }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                    label={props.label}
                    variant={props.variant || 'standard'}
                    multiline={props.area}
                    error={error ? true : false}
                    helperText={error ? props.errorMessage : props.helperText}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    fullWidth={props.fullWidth}
                    sx={{
                        flexGrow: props.grow ? 1 : undefined,
                        marginBottom: props.gutterBottom ? 2 : props.area ? 3 : undefined,
                        width: props.area ? '100%' : undefined,
                        ...props.sx,
                    }}
                />
            )}
        ></Controller>
    );
};

export default ControlledTextField;
