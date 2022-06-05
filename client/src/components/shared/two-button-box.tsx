import React, { MouseEventHandler } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface TwoButtonBoxProps {
    /** Text to show on success button (submit, upload, etc) */
    success: string;

    /** Function to run if the user presses cancel */
    onCancel: MouseEventHandler<HTMLButtonElement>;

    /** Function to run if the user presses the success button */
    onSuccess?: MouseEventHandler<HTMLButtonElement>;

    /** True if the button is a form submit button */
    submit?: boolean;

    /** True if align button right */
    right?: boolean;

    /** True if success button is disabled */
    disabled?: boolean;

    /** Format the Box component */
    sx?: object;
}

/**
 * Shows the cancel and success action buttons
 */
const TwoButtonBox = (props: TwoButtonBoxProps) => {
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
                disabled={props.disabled}
                sx={{ marginLeft: 2, marginRight: 2 }}
            >
                {props.success || 'Submit'}
            </Button>
        </Box>
    );
};

export default TwoButtonBox;
