import React from 'react';
import { redirect } from '../../functions/util';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 36,
        right: 36,
        zIndex: theme.zIndex.appBar + 1,
        color: theme.palette.common.white,
        [theme.breakpoints.down('md')]: {
            bottom: 12,
            right: 12,
        },
    },
    rootEditHistory: {
        display: 'flex',
        margin: '12px auto',
    },
    timeIcon: {
        marginRight: 8,
    },
}));

/**
 * Shows a floating action button
 * @param {object} props React props object
 * @param {string} props.path Path to redirect to on click
 * @param {"default" | "inherit" | "primary" | "secondary"} props.color Color for FAB
 * @param {string} [props.label] Label of the resource that is being acted on
 * @param {boolean} [props.edit] If true, will show edit button or else it'll show the add button
 * @param {boolean} [props.editHistory] If true, will show the edit history button + override all other options
 */
const AddButton = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    const redirectTo = () => {
        redirect(props.path || '#');
    };

    return (
        <Tooltip
            title={
                props.editHistory ? 'Show Edit History' : `${props.edit ? 'Edit' : 'Add'} ${props.label || 'resource'}`
            }
        >
            <Fab
                variant={props.editHistory ? 'extended' : 'circular'}
                size={matches ? 'small' : 'large'}
                color={props.editHistory ? 'primary' : props.color || 'default'}
                aria-label={props.editHistory ? 'edit history' : props.edit ? 'edit' : 'add'}
                onClick={redirectTo}
                className={props.editHistory ? classes.rootEditHistory : classes.root}
            >
                {props.editHistory ? (
                    <AccessTimeRoundedIcon className={classes.timeIcon} />
                ) : props.edit ? (
                    <EditIcon />
                ) : (
                    <AddIcon htmlColor="white" />
                )}
                {props.editHistory ? 'Show Edit History' : null}
            </Fab>
        </Tooltip>
    );
};

export default AddButton;
