import React, { useEffect } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface ControlledCheckboxProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** Name for the input */
    name: string;

    /** Label to display for the checkbox */
    label: string;

    /** Default value for the field */
    value?: boolean;

    /** React hook form setValue function; required if value is defined */
    setValue?: Function;

    /** If true, will disabled the checkbox */
    disabled?: boolean;

    /** Format the checkbox */
    sx?: object;
}

/**
 * Displays a controlled checkbox for a form
 */
const ControlledCheckbox = (props: ControlledCheckboxProps) => {
    useEffect(() => {
        if (!props.value) return;
        props.setValue(props.name, props.value);
    }, [props.value]);

    return (
        <Controller
            control={props.control}
            name={props.name}
            defaultValue={props.value}
            render={({ field: { onChange, onBlur, value } }) => (
                <FormControlLabel
                    control={<Checkbox />}
                    label={props.label}
                    disabled={props.disabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value}
                    sx={props.sx}
                />
            )}
        />
    );
};

export default ControlledCheckbox;
