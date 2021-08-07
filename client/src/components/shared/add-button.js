import React from 'react';
import { redirect } from '../../functions/util';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';
import { makeStyles, Tooltip, useMediaQuery, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 36,
        right: 36,
        zIndex: theme.zIndex.appBar + 1,
        color: theme.palette.common.white,
        [theme.breakpoints.down('sm')]: {
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

// TODO: Add a tooltip to the floating action button
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
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const redirectTo = () => {
        redirect(props.path);
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
