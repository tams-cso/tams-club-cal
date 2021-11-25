import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * Displays a trash can icon that can be clicked on.
 *
 * @param {object} props React props object
 * @param {string} props.label Resource label; will display as "Delete [label]"
 * @param {Function} props.onClick Function to run when clicked
 * @param {object} [props.sx] Format the IconButton component
 */
const TrashCan = (props) => {
    return (
        <Tooltip title={`Delete ${props.label}`} aria-label={props['aria-label']}>
            <IconButton aria-label={`delete ${props.label}`} onClick={props.onClick} size="large" sx={props.sx}>
                <DeleteOutlineIcon />
            </IconButton>
        </Tooltip>
    );
};

export default TrashCan;
