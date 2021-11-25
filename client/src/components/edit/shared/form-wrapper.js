import { styled } from '@mui/system';
import React from 'react';

const StyledForm = styled('form')``;

/**
 * Wrapper for the edit forms. Contains support for sx styling and
 * a default responsive padding.
 *
 * @param {object} props React props object
 * @param {Function} props.onSubmit Form submit handler
 * @param {*} props.children React child elements
 * @parma {object} props.sx Style the form element
 */
const FormWrapper = (props) => {
    return (
        <StyledForm onSubmit={props.onSubmit} sx={{ padding: { lg: 4, xs: 2 }, ...props.sx }}>
            {props.children}
        </StyledForm>
    );
};

export default FormWrapper;
