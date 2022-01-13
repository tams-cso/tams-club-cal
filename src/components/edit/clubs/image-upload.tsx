import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/system';
import type { Crop } from 'react-image-crop';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ReactCrop from 'react-image-crop';
import CustomImage from '../../shared/custom-image';
import TwoButtonBox from '../../shared/two-button-box';
import 'react-image-crop/dist/ReactCrop.css';

// Create wrapper components that supports sx styling
const StyledCanvas = styled('canvas')``;
const StyledLabel = styled('label')``;
const StyledInput = styled('input')``;

interface ImageUploadProps {
    /** useState function to set the file buffer value */
    setValue: Function;

    /** Width of the preview to display */
    width: number;

    /** Height of the preview to display */
    height: number;

    /** The url of the default image to display */
    src: string;

    /** The url of the fallback image to display if no previous image is avaliable */
    default: string;

    /** Alt text to display for accessibility purposes (won't actually show) */
    alt: string;

    /** Aspect ratio of the image; should be a fraction of width/height (eg. 16/9) */
    aspect: number;

    /** Maximum file size to upload in MB (default: 10 MB) */
    maxSize?: number;
}

/**
 * Component to handle image uploading. By default, this component will show a
 * preview of the image that is currently being used, as well as a button to upload a new image.
 * When an image is uploaded, a popup will appear asking the user to crop the image.
 * Once the user crops the image, the preview image will be updated and the values
 * will be stored in the form controller, to be uploaded to the server when the form is submitted.
 */
const ImageUpload = (props: ImageUploadProps) => {
    const [error, setError] = useState(null);
    const [src, setSrc] = useState(props.src);
    const [popupOpen, setPopupOpen] = useState(false);
    const [upImg, setUpImg] = useState<string>(null);
    const [crop, setCrop] = useState<Partial<Crop>>({ unit: '%', width: 80, aspect: props.aspect });
    const [completedCrop, setCompletedCrop] = useState(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    // When the crop is confirmed, crop the image
    useEffect(() => {
        // If the required variables are missing, do nothing
        if (!completedCrop || !canvasRef.current || !imgRef.current) return;

        // Get the references to the canvas, image, and crop
        const img = imgRef.current;
        const canvas = canvasRef.current;
        const crop = completedCrop;

        // Set the scale and create a virtual canvas to crop
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        // Set the canvas size to the crop size
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        // Set canvas graphic context to draw at the correct size
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        // Draw the cropped image at the right size on the canvas. For params see:
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
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

    // onLoad function for ReactCrop component
    // Will update the imageRef to the img element
    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    // When the image is uploaded, check to make sure
    // the file is valid, the correct image type, and < 10 MB
    // If these are all true, add the image to the cropper and open the popup
    const handleChange = (event) => {
        // Get the file from the upload
        const file = event.target.files[0];

        // Make sure file object is valid
        if (!event.target.files || event.target.files.length !== 1) {
            setError('Error uploading image.');
            return;
        }

        // Check file type - only images that aren't SVGs
        if (!file.type.startsWith('image') || file.type.startsWith('image/svg+xml')) {
            setError('Please upload an image (png/jpg/webp).');
            return;
        }

        // Convert from MiB to MB and divide by 1000000 to get MB from bytes
        // Make sure file size is less than 10 MB
        const size = (file.size * 0.9536743) / 1000000;
        const max = props.maxSize || 10;
        if (size > max) {
            setError('Image too large! Maximum file size is 10 MB.');
            return;
        } else setError(null);

        // Load the image in and open the popup when done
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setUpImg(reader.result as string);
            setPopupOpen(true);
        });
        reader.readAsDataURL(file);
    };

    // When the crop is completed in the popup,
    // update the preview to the newly uploaded and cropped image
    const saveCrop = async () => {
        // Get the canvas ref and completed crop
        const canvas: HTMLCanvasElement = canvasRef.current;
        const crop = completedCrop;

        // If either of these are undefined, do nothing
        if (!crop || !canvas) return;

        // Get the image data from the cropping canvas and save it
        const blob: Blob = await new Promise((resolve) => canvas.toBlob(resolve));
        props.setValue(blob);

        // Create an object URL for the data and save it to the src state variable
        // Then, close the popup
        const url = URL.createObjectURL(blob);
        setSrc(url);
        setPopupOpen(false);
    };

    // If the image upload is canceled (popup closed), reset the image to
    // wait for the next user upload
    const onCancel = () => {
        const newCrop: Partial<Crop> = { unit: '%', width: 80, height: 80, x: 10, y: 10, aspect: props.aspect };
        setUpImg(null);
        setCrop(newCrop);
        setCompletedCrop(null);
        setPopupOpen(false);
    };

    return (
        <React.Fragment>
            <Backdrop open={popupOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 10, color: '#fff' }}>
                <Container>
                    <Card>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                imageStyle={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                        <Typography sx={{ marginTop: 2, textAlign: 'center' }}>
                            Click and drag to crop the image
                        </Typography>
                        <TwoButtonBox
                            success="Upload"
                            onCancel={onCancel}
                            onSuccess={saveCrop}
                            sx={{ margin: '12px 0' }}
                        />
                    </Card>
                </Container>
            </Backdrop>
            <StyledCanvas ref={canvasRef} sx={{ display: 'none' }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { lg: 'row', xs: 'column' },
                }}
            >
                <CustomImage
                    src={src}
                    default={props.default}
                    width={props.width}
                    height={props.height}
                    alt={props.alt}
                    raised
                />
                <Button
                    variant="outlined"
                    sx={{
                        height: 36,
                        marginLeft: 2,
                        padding: 0,
                        marginTop: { lg: 0, xs: 3 },
                    }}
                >
                    <StyledLabel sx={{ width: '100%', height: 36, padding: '5px 8px', cursor: 'pointer' }}>
                        Upload image
                        <StyledInput
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            sx={{ position: 'fixed', top: '-100em' }}
                        ></StyledInput>
                    </StyledLabel>
                </Button>
            </Box>
            <Typography sx={{ marginTop: 2, textAlign: 'center', color: (theme) => theme.palette.error.main }}>
                {error}
            </Typography>
        </React.Fragment>
    );
};

export default ImageUpload;
