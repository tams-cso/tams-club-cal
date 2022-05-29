import React from 'react';
import StyledSpan from '../shared/styled-span';

interface MaterialSymbolProps {
    /** Name of the icon to display */
    icon: string;

    /** Style the span element using the sx prop */
    sx?: object;
}

/**
 * Wrapper for the Google Material Symbols.
 * See https://developers.google.com/fonts/docs/material_symbols for more info.
 */
const MaterialSymbol = (props: MaterialSymbolProps) => {
    return (
        <StyledSpan sx={{ paddingRight: '1rem', ...props.sx }} className="material-symbols-rounded">
            {props.icon}
        </StyledSpan>
    );
};

export default MaterialSymbol;
