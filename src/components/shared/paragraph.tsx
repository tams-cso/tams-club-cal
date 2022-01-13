import React from 'react';
import { parseLinks } from '../../util';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ParagraphProps {
    /** Text to display */
    text: string;

    /** Font size for the text; default is 1rem */
    fontSize?: string;

    /** True if the paragraph should have a smaller margin */
    smallMargin?: boolean;

    /** Style the entire element using the sx prop; this is a Box if there is text, otherwise it is an empty Typography element */
    sx?: object;
}

/**
 * Formats a paragraph of text.
 * This will split the text into its respective paragraphs,
 * adding a slight space between each body section.
 * Additionally, all links starting with http or https will be linked
 * correctly as a link element.
 */
const Paragraph = (props: ParagraphProps) => {
    // If there is no text, return an empty Typography element
    if (props.text === undefined) return <Typography sx={props.sx}></Typography>;

    // Split the pararaphs by the newline character
    const paragraphs = props.text.split('\n');

    // Create a list of Typography elements
    const paragraphElements = paragraphs.map((p, i) => (
        <Typography
            key={i}
            sx={{
                marginBottom: props.smallMargin ? 0.5 : 2,
                whiteSpace: 'pre-line',
                overflowX: 'hidden',
                fontSize: props.fontSize || '1rem',
            }}
        >
            {parseLinks(p)}
        </Typography>
    ));

    // Return the list of Typography elements, wrapped in a Box
    return <Box sx={props.sx}>{paragraphElements}</Box>;
};

export default Paragraph;
