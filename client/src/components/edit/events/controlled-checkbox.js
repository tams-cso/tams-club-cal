import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

/**
 * Displays a controlled checkbox for a form
 * 
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} props.name Name for the input
 * @param {string} props.label Label to display for the checkbox
 * @param {string} [props.value] Default value for the field
 * @param {Function} [props.setValue] React hook form setValue function; required if value is defined
 * @param {boolean} [props.disabled] If true, will disabled the checkbox
 * @param {object} [props.sx] Format the checkbox
 */
const ControlledCheckbox = (props) => {
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
