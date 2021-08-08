import React from 'react';
import { capitalize, makeStyles } from '@material-ui/core';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';

const useStyles = makeStyles({
    tooltip: {
        marginLeft: 12,
        marginRight: 8,
    },
});

/**
 * Simple component to display a select menu and icon button to select
 * the sorting method and order based on a supplied string array.
 *
 * @param {object} props React props object
 * @param {string[]} props.options Possible options for the select menu
 * @param {string} props.value State variable to store the value of the select
 * @param {Function} props.setValue State variable function to manipulate the value of the select
 * @param {boolean} props.reverse State variable to store whether or not sort order is reversed
 * @param {Function} props.setReverse State variable function that sets whether or not sort order is reversed
 */
const SortSelect = (props) => {
    const classes = useStyles();
    const handleChange = (event) => {
        props.setValue(event.target.value);
    };

    return (
        <React.Fragment>
            <FormControl>
                <Select value={props.value} onChange={handleChange} className={classes.select}>
                    {props.options.map((o) => (
                        <MenuItem value={o} key={o}>
                            {capitalize(o)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Tooltip
                title={props.reverse ? 'Sorted backwards' : 'Sorted forwards'}
                onClick={props.setReverse.bind(this, !props.reverse)}
                className={classes.tooltip}
            >
                <IconButton>{props.reverse ? <ArrowUpwardRoundedIcon /> : <ArrowDownwardRoundedIcon />}</IconButton>
            </Tooltip>
        </React.Fragment>
    );
};

export default SortSelect;
