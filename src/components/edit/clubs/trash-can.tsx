import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface TrashCanProps {
    /** Resource label; will display as "Delete [Label]" */
    label: string;

    /** Function to run when clicked */
    onClick: React.MouseEventHandler<HTMLButtonElement>;

    /** Format the IconButton component */
    sx?: object;
}

/**
 * Displays a trash can icon that can be clicked on.
 */
const TrashCan = (props: TrashCanProps) => {
    return (
        <Tooltip title={`Delete ${props.label}`} aria-label={props['aria-label']}>
            <IconButton aria-label={`delete ${props.label}`} onClick={props.onClick} size="large" sx={props.sx}>
                <DeleteOutlineIcon />
            </IconButton>
        </Tooltip>
    );
};

export default TrashCan;
