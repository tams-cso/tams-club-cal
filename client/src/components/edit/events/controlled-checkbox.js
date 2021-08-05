import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/**
 * Displays a controlled checkbox for a form
 * 
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} props.name Name for the input
 * @param {string} props.label Label to display for the checkbox
 * @param {string} [props.value] Default value for the field
 * @param {Function} [props.setValue] React hook form setValue function; required if value is defined
 * @param {string} [props.className] React classname
 * @param {boolean} [props.disabled] If true, will disabled the checkbox
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
                    className={props.className}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value}
                />
            )}
        />
    );
};

export default ControlledCheckbox;
