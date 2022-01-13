import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

interface FilterItemProps {
    /** Material Icon that represents the filter */
    icon: any;
    // TODO: Figure out the specific type lol

    /** Color of the filter */
    color: string;

    /** Name of the filter */
    name: string;

    /** Status of the filter -> on (T) or off (F) */
    status: boolean;
}

/**
 * Displays a specific volunteering filter,
 * with a passed in icon, color, and status.
 * If the status resolves to false, the filter will be hidden with "display: none".
 */
const FilterItem = (props: FilterItemProps) => {
    return (
        <ListItem sx={{ color: props.color, display: props.status ? 'flex' : 'none' }}>
            <ListItemIcon>{props.icon}</ListItemIcon>
            <ListItemText>
                <Typography>{props.name}</Typography>
            </ListItemText>
        </ListItem>
    );
};

export default FilterItem;
