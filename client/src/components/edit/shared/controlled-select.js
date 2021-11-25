import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import { FormControl, FormHelperText } from '@mui/material';

/**
 * Displays a controlled select to edit.
 * If the select input is in an array of objects, then you must define the parentName, index, and name.
 * This value will be concatenated inside of the component to form the name (ie. [parentName].[index].[name])
 * All children should be instances of MenuItem components, as the select options
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} [props.parentName] Name for the input's parent
 * @param {number} [props.index] Index of object in array
 * @param {string} props.name Name for the input
 * @param {'standard' | 'outlined' | 'filled'} [props.variant] Variant of the select field
 * @param {string} [props.value] Default value for the field
 * @param {Function} [props.setValue] React hook form setValue function; required if value is defined
 * @param {string} [props.helperText] If defined, will show helper text
 * @param {boolean} [props.error] If true, sets error state of the box to true
 * @param {boolean} [props.required] True if the field is required
 * @param {*} [props.children] Children elements to display; should all be MenuItem components
 * @param {object} [props.sx] Format the Select component
 */
const ControlledSelect = (props) => {
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
                <FormControl>
                    <Select
                        variant={props.variant || 'standard'}
                        error={props.error}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        sx={props.sx}
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
