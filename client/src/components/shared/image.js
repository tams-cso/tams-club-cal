import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: 'inherit',
        objectFit: 'cover',
        display: 'block',
        fontSize: 0,
    },
});

const Image = (props) => {
    const [src, setSrc] = useState(props.src);

    const inavlidImage = () => {
        setSrc(props.default);
    };

    const classes = useStyles();
    return (
        <img
            id={props.id}
            className={`${props.className} ${classes.root}`}
            src={src}
            alt={props.alt}
            onError={inavlidImage}
            width={props.width}
            height={props.height}
        />
    );
};

export default Image;
