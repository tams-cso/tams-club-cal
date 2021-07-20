import { makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from '../../shared/image';
import TwoButtonBox from '../shared/two-button-box';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    input: {
        position: 'fixed',
        top: '-100em',
    },
    labelWrapper: {
        height: 36,
        marginLeft: 12,
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            marginTop: 12,
        },
    },
    label: {
        width: '100%',
        height: '100%',
        padding: 8,
        cursor: 'pointer',
    },
    error: {
        marginTop: 8,
        textAlign: 'center',
        color: theme.palette.error.main,
    },
    canvas: {
        display: 'none',
    },
    caption: {
        textAlign: 'center',
        marginTop: 8,
    },
    popup: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    buttonBox: {
        margin: '12px 0',
    },
    cropWrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

/**
 * Shows a preview of the image with a button to upload the image
 *
 * @param {object} props React props object
 * @param {Function} props.setValue useState function to set the file buffer value
 * @param {number} props.width Width of the preview to display
 * @param {number} props.height Height of the preview to display
 * @param {string} props.src The url of the default image to display
 * @param {string} props.defult The url of the fallback image to display if no previous image is avaliable
 * @param {string} props.alt Alt text to display for accessibility purposes (won't actually show)
 * @param {number} props.aspect Aspect ratio of the image; should be a fraction of width/height (eg. 16/9)
 */
const ImageUpload = (props) => {
    const [error, setError] = useState(null);
    const [src, setSrc] = useState(props.src);
    const [popupOpen, setPopupOpen] = useState(false);
    const [upImg, setUpImg] = useState();
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 80, aspect: props.aspect });
    const [completedCrop, setCompletedCrop] = useState(null);
    const classes = useStyles();

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    });

    const handleChange = (event) => {
        const file = event.target.files[0];

        // Make sure file object is valid
        if (!event.target.files || event.target.files.length !== 1) {
            setError('Error uploading image.');
            return;
        }

        // Check file type - only image that's not svg
        if (!file.type.startsWith('image') || file.type.startsWith('image/svg+xml')) {
            setError('Please upload an image (png/jpg/webp).');
            return;
        }

        // Convert from MiB to MB and divide by 1000000 to get MB from bytes
        // Make sure file size is less than 10 MB
        const size = (file.size * 0.9536743) / 1000000;
        if (size > 10) {
            setError('Image too large! Maximum file size is 10 MB.');
            return;
        } else setError(null);

        // Add image to cropper
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setUpImg(reader.result);
            setPopupOpen(true);
        });
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (!completedCrop || !canvasRef.current || !imgRef.current) return;

        const img = imgRef.current;
        const canvas = canvasRef.current;
        const crop = completedCrop;

        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    const saveCrop = async () => {
        const canvas = canvasRef.current;
        const crop = completedCrop;
        console.log({ canvas, crop });

        if (!crop || !canvas) {
            return;
        }

        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        props.setValue(blob);

        const url = URL.createObjectURL(blob);
        setSrc(url);
        setPopupOpen(false);
    };

    const onCancel = () => {
        setUpImg(null);
        setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10, aspect: props.aspect });
        setCompletedCrop(null);
        setPopupOpen(false);
    };

    return (
        <React.Fragment>
            <Backdrop open={popupOpen} className={classes.popup}>
                <Container>
                    <Card>
                        <Box className={classes.cropWrapper}>
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                imageStyle={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                        <Typography className={classes.caption}>Click and drag to crop the image</Typography>
                        <TwoButtonBox
                            success="Upload"
                            onCancel={onCancel}
                            onSuccess={saveCrop}
                            className={classes.buttonBox}
                        />
                    </Card>
                </Container>
            </Backdrop>
            <canvas ref={canvasRef} className={classes.canvas} />
            <Box className={classes.root}>
                <Image
                    src={src}
                    default={props.default}
                    width={props.width}
                    height={props.height}
                    alt={props.alt}
                    raised
                />
                <Button variant="outlined" className={classes.labelWrapper}>
                    <label className={classes.label}>
                        Upload image
                        <input type="file" accept="image/*" onChange={handleChange} className={classes.input}></input>
                    </label>
                </Button>
            </Box>
            <Typography className={classes.error}>{error}</Typography>
        </React.Fragment>
    );
};

export default ImageUpload;
