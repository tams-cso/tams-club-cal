import { styled } from '@mui/system';
import React from 'react';

// Wrap the HTML form component in a styled wrapper to use sx formatting
const StyledForm = styled('form')``;

interface FormWrapperProps extends React.HTMLProps<HTMLFormElement> {
    /** Form submit handler */
    onSubmit: React.FormEventHandler<HTMLFormElement>;

    /** Style the Form component */
    sx?: object;
}

/**
 * Wrapper for the edit forms. Contains support for sx styling and
 * a default responsive padding.
 */
const FormWrapper = (props: FormWrapperProps) => {
    return (
        <StyledForm onSubmit={props.onSubmit} sx={{ padding: { lg: 4, xs: 2 }, ...props.sx }}>
            {props.children}
        </StyledForm>
    );
};

export default FormWrapper;
