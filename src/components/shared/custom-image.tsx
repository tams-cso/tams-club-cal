import React, { useEffect, useState } from 'react';
import { getCdnUrl } from '../../api';
import { styled } from '@mui/system';

import Paper from '@mui/material/Paper';
// TODO: can someone get next/image to work -> image optimizations probably but I can't get CSS to match (https://nextjs.org/docs/basic-features/image-optimization)
// An issue with this is because it requires the width + height but I can't get it to scale properly >:((

// Gets the actual URL of the image
const url = (src: string) => (!src ? '' : src.endsWith('.webp') ? `${getCdnUrl()}/${src}` : src);

// Create a styled image component to use MUI's sx prop
const StyledImage = styled('img')``;

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
 * @param {object} [props.sx] Custom styles to apply to the image
 */
const CustomImage = (props) => {
    const [src, setSrc] = useState(props.default);

    const inavlidImage = () => {
        setSrc(props.default);
    };
    useEffect(() => {
        if (props.src === '') setSrc(props.default);
        else setSrc(url(props.src));
    }, [props.src]);

    return (
        <Paper
            elevation={props.raised ? 2 : 0}
            sx={{ backgroundColor: props.transparent ? 'transparent' : null, ...props.sx }}
        >
            <StyledImage
                id={props.id}
                src={src}
                alt={props.alt}
                onError={inavlidImage}
                sx={{
                    width: props.width || '100%',
                    height: props.height || 'inherit',
                    objectFit: 'cover',
                    display: 'block',
                    fontSize: 0,
                }}
            />
        </Paper>
    );
};

export default CustomImage;
