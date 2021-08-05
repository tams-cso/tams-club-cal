import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    grow: {
        flexGrow: 1,
    },
    area: {
        width: '100%',
        marginBottom: 16,
    },
    gutterBottom: {
        marginBottom: 12,
    },
});

/**
 * Displays a controlled text field to edit.
 * If required is true, then you must define the errors and errorMessage objects.
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} [props.setValue] React hook form setValue function; required if value is defined
 * @param {string} [props.value] Default value for the field
 * @param {string} props.label Text field label
 * @param {string} props.name Name for the input
 * @param {'standard' | 'outlined' | 'filled'} [props.variant] Variant of the text field
 * @param {boolean} [props.area] True if a textarea; will give it multiline, show 4 rows, 100% width, and a 16px margin bottom
 * @param {boolean} [props.grow] If true, the element will have flex grow set to 1
 * @param {boolean} [props.fullWidth] If true, the text box will expand to take up the width of the entire container
 * @param {boolean} [props.gutterBottom] If true, adds a margin of 12px below box
 * @param {boolean} [props.required] True if field is required
 * @param {string} [props.errorMessage] Error message to display in the case of an error; required if 'required' defined
 * @param {string} [props.helperText] If defined, will show helper text
 * @param {string} [props.className] React classname
 */
const ControlledTextField = (props) => {
    const classes = useStyles();

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
                    multiline={props.area}
                    error={error}
                    helperText={error ? props.errorMessage : props.helperText}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    fullWidth={props.fullWidth}
                    className={`${props.className} ${props.grow ? classes.grow : ''} ${props.area ? classes.area : ''} ${props.gutterBottom ? classes.gutterBottom : ''}`}
                />
            )}
        ></Controller>
    );
};

export default ControlledTextField;
