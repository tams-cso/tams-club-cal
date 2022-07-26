import React from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme } from '@mui/material';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

interface AddButtonProps {
    /** Path to redirect to on click */
    path: string;

    /** Color for the button */
    color?: 'default' | 'inherit' | 'primary' | 'secondary';

    /** Label for the resource that is being acted on */
    label?: string;

    /** Shows edit button if true or else it'll just show the add button by default */
    edit?: boolean;

    /** Shows the edit history button and will override all other options if true */
    editHistory?: boolean;

    /** True if button should be hidden */
    hidden?: boolean;
}

/**
 * Shows a floating action button
 */
const AddButton = (props: AddButtonProps) => {
    const router = useRouter();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const redirectTo = () => {
        router.push(props.path || '#');
    };

    // Change position of button to the left side if it's the edit history button
    const leftOrRight = props.editHistory ? { left: { lg: 32, xs: 12 } } : { right: { lg: 32, xs: 12 } };

    // Calculate title of tooltip
    const tooltipTitle = props.editHistory
        ? 'Show Edit History'
        : `${props.edit ? 'Edit' : 'Add'} ${props.label || 'resource'}`;

    return (
        <Tooltip title={tooltipTitle}>
            <Fab
                variant={props.editHistory ? 'extended' : 'circular'}
                size={matches ? 'small' : 'large'}
                color={props.editHistory ? 'primary' : props.color || 'default'}
                aria-label={props.editHistory ? 'edit history' : props.edit ? 'edit' : 'add'}
                onClick={redirectTo}
                sx={{
                    display: props.hidden ? 'none' : 'flex',
                    margin: props.editHistory ? '12px auto' : 'auto',
                    position: 'fixed',
                    bottom: { lg: 32, xs: 12 },
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                    color: (theme) => theme.palette.common.white,
                    ...leftOrRight,
                }}
            >
                {props.editHistory ? (
                    <AccessTimeRoundedIcon sx={{ marginRight: 1 }} width="16" />
                ) : props.edit ? (
                    <EditIcon width="16" />
                ) : (
                    <AddIcon htmlColor="white" width="16" />
                )}
                {props.editHistory ? 'Show Edit History' : null}
            </Fab>
        </Tooltip>
    );
};

export default AddButton;
