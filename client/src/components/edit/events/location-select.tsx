import React from 'react';
import type { Control, FieldValues, UseFormSetValue } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import ControlledSelect from '../shared/controlled-select';
import data from '../../../data.json';

interface LocationSelectProps {
    /** React hook form controller */
    control: Control<FieldValues, object>;

    /** Default value for the field */
    value: string;

    /** React hook form setValue function */
    setValue: UseFormSetValue<FieldValues>;

    /** If defined, helperText field will show the error if true */
    error?: boolean;

    /** Format the LocationSelect component */
    sx?: object;
}

/**
 * Select a location from the list of predefined rooms
 * using a ControlledSelect component, with an option to
 * select "none" by default or "other" at the bottom of the list
 */
const LocationSelect = (props: LocationSelectProps) => {
    return (
        <ControlledSelect
            control={props.control}
            setValue={props.setValue}
            value={props.value}
            name="location"
            label="Location"
            variant="outlined"
            error={props.error}
            helperText={props.error ? 'Please select a location' : null}
            sx={props.sx}
        >
            <MenuItem key="none" value="none">
                No Location Set
            </MenuItem>
            {data.rooms.map((r) => (
                <MenuItem value={r.value} id={r.value} key={r.value}>
                    {r.label}
                </MenuItem>
            ))}
            <MenuItem key="other" value="other">
                Other...
            </MenuItem>
        </ControlledSelect>
    );
};

export default LocationSelect;
