import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import type { Control, FieldValues, UseFormSetValue } from 'react-hook-form';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

interface ControlledSelectProps extends React.HTMLProps<HTMLDivElement> {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** Name for the input */
    name: string;

    /** Name for the input's parent */
    parentName?: string;

    /** Index of object in array */
    index?: number;

    /** Variant of the select field */
    variant?: 'standard' | 'outlined' | 'filled';

    /** Whether or not to set the width of the select to the width of the input */
    autoWidth?: boolean;

    /** Default value for the field */
    value?: string;

    /** React hook form setValue function; required if value is defined */
    setValue?: UseFormSetValue<FieldValues>;

    /** If defined, will show helper text */
    helperText?: string;

    /** Label text to display */
    label?: string;

    /** If true, sets error state of the box to true */
    error?: boolean;

    /** True if the field is required */
    required?: boolean;

    /** Format the Select component */
    sx?: object;

    /** Format the FormControl component */
    wrapperSx?: object;
}

/**
 * Displays a controlled select to edit.
 * If the select input is in an array of objects, then you must define the parentName, index, and name.
 * This value will be concatenated inside of the component to form the name (ie. [parentName].[index].[name])
 * All children should be instances of MenuItem components, as the select options
 */
const ControlledSelect = (props: ControlledSelectProps) => {
    // When the component mounts, set the value of the current select to the default value
    useEffect(() => {
        // If there is no default value, then do nothing
        if (!props.value) return;

        // If the value is nested, append the parent name to the name or else just use the name
        // and set that value to props.value
        const name = props.parentName && props.index ? `${props.parentName}.${props.index}.${props.name}` : props.name;
        props.setValue(name, props.value);
    }, [props.value]);

    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={{ required: props.required || false }}
            defaultValue={props.value}
            render={({ field: { onChange, onBlur, value } }) => (
                <FormControl sx={props.wrapperSx}>
                    <InputLabel id={`select-label-${props.name}`}>{props.label}</InputLabel>
                    <Select
                        variant={props.variant || 'standard'}
                        error={props.error}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        sx={props.sx}
                        autoWidth={props.autoWidth}
                        label={props.label}
                    >
                        {props.children}
                    </Select>
                    <FormHelperText>{props.helperText}</FormHelperText>
                </FormControl>
            )}
        ></Controller>
    );
};

export default ControlledSelect;
