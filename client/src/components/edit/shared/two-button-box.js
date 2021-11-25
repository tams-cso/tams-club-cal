import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/**
 * Shows the cancel and success action buttons
 *
 * @param {object} props React props object
 * @param {string} props.success Text to show on success button (submit, upload, etc)
 * @param {Function} props.onCancel Function to run if the user presses cancel
 * @param {Function} props.onSuccess Function to run if the user presses the success button
 * @param {boolean} [props.submit] True if the button is a form submit button
 * @param {boolean} [props.right] True if align button right
 * @param {object} [props.sx] Format the Box component
 */
const TwoButtonBox = (props) => {
    return (
        <Box
            sx={{
                padding: '0 24px',
                display: 'flex',
                justifyContent: { lg: props.right ? 'flex-end' : 'center', xs: 'center' },
                ...props.sx,
            }}
        >
            <Button
                color="inherit"
                size="small"
                onClick={props.onCancel}
                sx={{ marginLeft: 2, marginRight: 2, color: 'error.main' }}
            >
                Cancel
            </Button>
            <Button
                type={props.submit ? 'submit' : 'button'}
                variant="outlined"
                color="primary"
                size="large"
                onClick={props.onSuccess}
                sx={{ marginLeft: 2, marginRight: 2 }}
            >
                {props.success || 'Submit'}
            </Button>
        </Box>
    );
};

export default TwoButtonBox;
