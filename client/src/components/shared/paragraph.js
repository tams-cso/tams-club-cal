import React from 'react';
import { parseLinks } from '../../functions/util';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Formats a paragraph of text.
 * This will split the text into its respective paragraphs,
 * adding a slight space between each body section.
 * Additionally, all links starting with http or https will be linked
 * correctly as a link element.
 *
 * @param {object} props React props object
 * @param {string} props.text Text to display
 * @param {string} [props.fontSize] Font size for the text
 * @param {boolean} [props.smallMargin] True if the paragraph should have a smaller margin
 * @param {object} [props.sx] Style the entire element using the sx prop, this is a Box if there is text else it is an empty Typography element
 */
const Paragraph = (props) => {
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
