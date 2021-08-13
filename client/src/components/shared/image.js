import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import { getCdnUrl } from '../../functions/api';

const useStyles = makeStyles({
    root: {
        width: (props) => props.width || '100%',
        height: (props) => props.height || 'inherit',
        objectFit: 'cover',
        display: 'block',
        fontSize: 0,
    },
    wrapper: {
        backgroundColor: (props) => (props.transparent ? 'transparent' : null),
    }
});

const url = (src) => (!src ? '' : src.endsWith('.webp') ? `${getCdnUrl()}/${src}` : src);

/**
 * Displays an image given a dynamic src.
 * The image will by default be objectFit: cover and try to fit 100% of the width if no width prop is specified.
 *
 * @param {object} props React props object
 * @param {string} props.src Src of the image to display; will dynamically update image
 * @param {string} props.default Src of the default fallback image to display
 * @param {string} props.alt Alt text to display for accessibility purposes (won't actually show)
 * @param {number | string} [props.width] Width of the image
 * @param {number | string} [props.height] Height of the image
 * @param {boolean} [props.raised] True to add drop shadow to image
 * @param {boolean} [props.transparent] True if no background color
 */
const Image = (props) => {
    const [src, setSrc] = useState(url(props.src));
    const classes = useStyles({ width: props.width, height: props.height, transparent: props.transparent });

    const inavlidImage = () => {
        setSrc(props.default);
    };
    useEffect(() => {
        if (props.src === '') setSrc(props.default);
        else setSrc(url(props.src));
    }, [props.src]);

    return (
        <Paper elevation={props.raised ? 2 : 0} className={`${props.className} ${classes.wrapper}`}>
            <img id={props.id} className={classes.root} src={src} alt={props.alt} onError={inavlidImage} />
        </Paper>
    );
};

export default Image;
