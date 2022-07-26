import React from 'react';
import Box from '@mui/material/Box';

interface FormBoxProps extends React.HTMLProps<HTMLFormElement> {
    /** Style the box element */
    sx?: object;
}

/**
 * Simple flex div wrapper for form elements that displays horizontally
 * on larger screens and vertically on smaller screens. Use the Spacer component
 * to add spacing (it will also adapt to be vertical spacing on smaller screens).
 */
const FormBox = (props: FormBoxProps) => {
    return <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' }, ...props.sx }}>
        {props.children}
    </Box>;
};

export default FormBox;
