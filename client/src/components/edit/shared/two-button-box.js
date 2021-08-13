import React from 'react';
import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '0 24px',
        display: 'flex',
        justifyContent: props => props.right ? 'flex-end' : 'center',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
        }
    },
    button: {
        marginLeft: 12,
        marginRight: 12,
    },
    cancel: {
        color: theme.palette.error.main,
    },
}));

/**
 * Shows the cancel and success action buttons
 *
 * @param {object} props React props object
 * @param {string} props.success Text to show on success button (submit, upload, etc)
 * @param {Function} props.onCancel Function to run if the user presses cancel
 * @param {Function} props.onSuccess Function to run if the user presses the success button
 * @param {boolean} [props.submit] True if the button is a form submit button
 * @param {boolean} [props.right] True if align button right
 * @param {string} props.className React className object
 */
const TwoButtonBox = (props) => {
    const classes = useStyles({ right: props.right });
    return (
        <Box className={`${classes.root} ${props.className}`}>
            <Button
                color="inherit"
                size="small"
                onClick={props.onCancel}
                className={`${classes.button} ${classes.cancel}`}
            >
                Cancel
            </Button>
            <Button
                type={props.submit ? 'submit' : 'button'}
                variant="outlined"
                color="primary"
                size="large"
                onClick={props.onSuccess}
                className={classes.button}
            >
                {props.success || 'Submit'}
            </Button>
        </Box>
    );
};

export default TwoButtonBox;
