import React from 'react';
import { capitalize, SelectChangeEvent } from '@mui/material';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

interface SortSelectProps {
    /** Possible options for the select menu */
    options: string[];

    /** State variable to store the value of the select */
    value: string;

    /** State variable function to change the value of the select */
    setValue: Function;

    /** State variable to store whether or not the sort order is reversed */
    reverse: boolean;

    /** State variable function to change the value of the sorting order */
    setReverse: Function;
}

/**
 * Simple component to display a select menu and icon button to select
 * the sorting method and order based on a supplied string array.
 */
const SortSelect = (props: SortSelectProps) => {
    // Set state value when user changes selection
    const handleChange = (event: SelectChangeEvent<string>) => {
        props.setValue(event.target.value);
    };

    return (
        <React.Fragment>
            <FormControl>
                <Select value={props.value} onChange={handleChange} variant="standard">
                    {props.options
                        ? props.options.map((o) => (
                              <MenuItem value={o} key={o}>
                                  {capitalize(o)}
                              </MenuItem>
                          ))
                        : null}
                </Select>
            </FormControl>
            <Tooltip
                title={props.reverse ? 'Sorted descending' : 'Sorted ascending'}
                onClick={props.setReverse.bind(this, !props.reverse)}
                sx={{
                    marginLeft: 3,
                    marginRight: 2,
                }}
            >
                <IconButton size="large">
                    {props.reverse ? <ArrowUpwardRoundedIcon /> : <ArrowDownwardRoundedIcon />}
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
};

export default SortSelect;
