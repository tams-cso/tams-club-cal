import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import Select from '@material-ui/core/Select';
import { FormControl, FormHelperText } from '@material-ui/core';

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
 * @param {string} [props.className] React classname
 * @param {boolean} [props.error] If true, sets error state of the box to true
 * @param {*} [props.children] Children elements to display; should all be MenuItem components
 */
const ControlledSelect = (props) => {
    const name = props.parentName && props.index ? `${props.parentName}.${props.index}.${props.name}` : props.name;

    useEffect(() => {
        if (!props.value) return;
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
                        className={props.className}
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
