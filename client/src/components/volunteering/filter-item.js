import React from 'react';

import SvgIcon from '@mui/material/SvgIcon';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

/**
 * Displays a specific volunteering filter,
 * with a passed in icon, color, and status.
 * If the status resolves to false, the filter will be hidden with "display: none".
 *
 * @param {object} props React props object
 * @param {SvgIcon} props.icon Material Icon that represents the filter
 * @param {string} props.color Color of the filter
 * @param {string} props.children Name of the filter
 * @param {boolean} props.status Status of the filter (on or off)
 * @returns
 */
const FilterItem = (props) => {
    return (
        <ListItem sx={{ color: props.color, display: props.status ? 'flex' : 'none' }}>
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText>
                <Typography>{props.children}</Typography>
            </ListItemText>
        </ListItem>
    );
};

export default FilterItem;
