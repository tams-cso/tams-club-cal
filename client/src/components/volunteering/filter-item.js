import React from 'react';
import { makeStyles } from '@material-ui/core';

import SvgIcon from '@material-ui/core/SvgIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        color: (props) => props.color,
    },
    hidden: {
        display: 'none',
    },
});

/**
 * Displays a specific volunteering filter
 *
 * @param {object} props React props object
 * @param {SvgIcon} props.icon Material Icon that represents the filter
 * @param {string} props.color Color of the filter
 * @param {string} props.children Name of the filter
 * @param {boolean} props.status Status of the filter (on or off)
 * @returns
 */
const FilterItem = (props) => {
    const classes = useStyles({ color: props.color });
    return (
        <ListItem className={`${classes.root} ${props.status ? '' : classes.hidden}`}>
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText>
                <Typography>{props.children}</Typography>
            </ListItemText>
        </ListItem>
    );
};

export default FilterItem;
