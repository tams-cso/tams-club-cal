import React, { useEffect } from 'react';

import { Controller } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

/**
 * Shows a checkbox for a single filter
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {Function} props.setValue React hook form set value function
 * @param {string} props.name Name of the field
 * @param {string} props.label Label of the field
 * @param {boolean} props.value True if checked by default
 */
const ControlledFilterCheckbox = (props) => {
    useEffect(() => {
        props.setValue(props.name, props.value);
    }, []);
    return (
        <Controller
            control={props.control}
            name={props.name}
            render={({ field: { onChange, onBlur, value } }) => (
                <FormControlLabel
                    control={
                        <Checkbox onChange={onChange} onBlur={onBlur} checked={value} defaultChecked={props.value} />
                    }
                    label={props.label}
                />
            )}
        />
    );
};

export default ControlledFilterCheckbox;
