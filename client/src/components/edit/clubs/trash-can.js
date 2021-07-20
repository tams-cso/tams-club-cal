import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

/**
 * Displays a trash can
 *
 * @param {object} props React props object
 * @param {string} props.label Resource label; will display as "Delete [label]"
 * @param {Function} props.onClick Function to run when clicked
 * @param {string} props.className Mui className
 * @returns
 */
const TrashCan = (props) => {
    return (
        <Tooltip title={`Delete ${props.label}`} aria-label={props['aria-label']} className={props.className}>
            <IconButton aria-label={`delete ${props.label}`} onClick={props.onClick}>
                <DeleteOutlineIcon />
            </IconButton>
        </Tooltip>
    );
};

export default TrashCan;
