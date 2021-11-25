import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import ControlledSelect from './controlled-select';
import data from '../../../data.json';

// TODO: Allow the user to input a custom location

/**
 * Select a location from the list of predefined rooms
 * using a ControlledSelect component.
 *
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} props.value Default value for the field
 * @param {Function} props.setValue React hook form setValue function
 * @param {string} [props.hideHelper] If true will hide helper text
 * @param {boolean} [props.error] If defined, helperText field will show the error if true
 * @param {object} [props.sx] Format the LocationSelect component
 */
const LocationSelect = (props) => {
    return (
        <ControlledSelect
            control={props.control}
            setValue={props.setValue}
            value={props.value}
            name="location"
            variant="outlined"
            error={props.error}
            helperText={
                props.error
                    ? 'Please select a location'
                    : props.hideHelper
                    ? null
                    : 'If start and end times are defined, this will create a reservation'
            }
            sx={props.sx}
        >
            <MenuItem value="none">No Location Set</MenuItem>
            {data.rooms.map((r) => (
                <MenuItem value={r.value} id={r.value}>
                    {r.label}
                </MenuItem>
            ))}
        </ControlledSelect>
    );
};

export default LocationSelect;
