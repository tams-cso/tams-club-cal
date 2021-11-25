import { styled } from '@mui/system';
import React from 'react';

const StyledForm = styled('form')``;

/**
 * Wrapper for the edit forms. Contains support for sx styling and
 * a default responsive padding.
 *
 * @param {object} props React props object
 * @param {*} props.children React child elements
 */
const FormWrapper = (props) => {
    return <StyledForm sx={{ padding: { lg: 4, xs: 2 }, ...props.sx }}>{props.children}</StyledForm>;
};

export default FormWrapper;
