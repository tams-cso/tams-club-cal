import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';

/**
 * Displays a controlled text field to edit.
 * If required is true, then you must define the errors and errorMessage objects.
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} props.label Text field label
 * @param {string} props.name Name for the input
 * @param {'standard' | 'outlined' | 'filled'} [props.variant] Variant of the text field
 * @param {number} [props.rows] Number of rows to display
 * @param {boolean} [props.multiline] True if a multiline input
 * @param {string} [props.value] Default value for the field
 * @param {Function} [props.setValue] React hook form setValue function; required if value is defined
 * @param {boolean} [props.required] True if field is required
 * @param {string} [props.errorMessage] Error message to display in the case of an error; required if 'required' defined
 * @param {string} [props.className] React classname
 */
const ControlledTextField = (props) => {
    useEffect(() => {
        if (!props.value) return;
        props.setValue(props.name, props.value);
    }, [props.value]);

    return (
        <Controller
            control={props.control}
            name={props.name}
            rules={{ required: props.required || false }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                    label={props.label}
                    variant={props.variant || 'standard'}
                    rows={props.rows || 1}
                    multiline={props.multiline || false}
                    error={error}
                    helperText={error ? props.errorMessage : null}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    className={props.className}
                />
            )}
        ></Controller>
    );
};

export default ControlledTextField;
