import React from 'react';
import { makeStyles } from '@material-ui/core';
import { parseLinks } from '../../functions/util';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        marginBottom: 8,
        whiteSpace: 'pre-line',
        overflowX: 'hidden',
        fontSize: (props) => props.fontSize || '1rem',
    },
});

/**
 * Formats a paragraph of text.
 * This will split the text into its respective paragraphs,
 * adding a slight space between each body section.
 * Additionally, all links starting with http or https will be linked
 * correctly as a link element.
 *
 * @param {object} props React props object
 * @param {string} props.className React class name
 * @param {string} props.text Text to display
 * @param {string} [props.fontSize] Font size for the text
 */
const Paragraph = (props) => {
    if (props.text === undefined) return <Typography className={props.className}></Typography>;

    const classes = useStyles({ fontSize: props.fontSize });

    const paragraphs = props.text.split('\n');
    const paragraphElements = paragraphs.map((p, i) => (
        <Typography className={classes.root} key={i}>
            {parseLinks(p)}
        </Typography>
    ));
    return <div className={props.className}>{paragraphElements}</div>;
};

export default Paragraph;
