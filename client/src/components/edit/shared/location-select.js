import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import ControlledSelect from './controlled-select';
import data from '../../../data.json';

/**
 * Select a location from the list of predefined rooms
 * 
 * @param {object} props React props object
 * @param {*} props.control React hook form controller
 * @param {string} props.value Default value for the field
 * @param {Function} props.setValue React hook form setValue function
 * @param {string} [props.className] React classname
 */
const LocationSelect = (props) => {
    return (
        <ControlledSelect
            control={props.control}
            setValue={props.setValue}
            value={props.value}
            name="location"
            variant="outlined"
            helperText="If start and end times are defined, this will create a reservation"
            className={props.className}
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
