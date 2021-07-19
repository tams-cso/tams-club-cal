import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        width: (props) => props.width || '100%',
        height: (props) => props.height || 'inherit',
        objectFit: 'cover',
        display: 'block',
        fontSize: 0,
    },
});

/**
 * Displays an image given a dynamic src.
 * The image will by default be objectFit: cover and try to fit 100% of the width if no width prop is specified.
 *
 * @param {object} props React props object
 * @param {string} props.src Src of the image to display; will dynamically update image
 * @param {string} props.default Src of the default fallback image to display
 * @param {string} props.alt Alt text to display for accessibility purposes (won't actually show)
 * @param {number} [props.width] Width of the image
 * @param {number} [props.height] Height of the image
 * @param {boolean} props.raised True to add drop shadow to image
 */
const Image = (props) => {
    const [src, setSrc] = useState(props.src);
    const classes = useStyles({ width: props.width, height: props.height });

    const inavlidImage = () => {
        setSrc(props.default);
    };

    useEffect(() => {
        setSrc(props.src);
    }, [props.src]);

    return (
        <Paper elevation={props.raised ? 2 : 0} className={props.className}>
            <img
                id={props.id}
                className={classes.root}
                src={src}
                alt={props.alt}
                onError={inavlidImage}
            />
        </Paper>
    );
};

export default Image;
