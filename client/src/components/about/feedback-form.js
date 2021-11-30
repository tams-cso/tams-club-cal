import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { openPopup } from '../../redux/actions';
import { Feedback } from '../../functions/entries';
import { postFeedback } from '../../functions/api';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ControlledTextField from '../edit/shared/controlled-text-field';
import FormWrapper from '../edit/shared/form-wrapper';
import UploadBackdrop from '../edit/shared/upload-backdrop';

/**
 * Feedback form for About page
 */
const FeedbackForm = () => {
    const [backdrop, setBackdrop] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
    } = useForm();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        // Make sure feedback isn't just spaces lol
        if (data.feedback.trim().length === 0) {
            setError('feedback');
            return;
        }

        // Start the upload process
        setBackdrop(true);

        // Create feedback object and send POST request to server
        const name = data.name ? data.name.trim() : '';
        const feedback = new Feedback(null, data.feedback.trim(), name, new Date().valueOf());
        const res = await postFeedback(feedback);

        // Finished uploading
        setBackdrop(false);

        // Check if feedback was successfully sent and send message to user
        if (res.status == 200) {
            setValue('feedback', '');
            setValue('name', '');
            dispatch(openPopup('Feedback successfully submitted!', 2));

        } else dispatch(openPopup('Error submitting feedback', 4));
    };

    return (
        <React.Fragment>
            <UploadBackdrop open={backdrop} />
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <ControlledTextField
                    control={control}
                    register={register}
                    setValue={setValue}
                    value=""
                    name="feedback"
                    label="Feedback"
                    errorMessage="Please enter a valid feedback before submitting"
                    area
                    required
                    variant="outlined"
                />
                <Box sx={{ display: 'flex' }}>
                    <ControlledTextField
                        control={control}
                        register={register}
                        setValue={setValue}
                        value=""
                        name="name"
                        label="Name"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        color="primary"
                        size="large"
                        sx={{ height: 48, marginLeft: 4 }}
                    >
                        Submit
                    </Button>
                </Box>
            </FormWrapper>
        </React.Fragment>
    );
};

export default FeedbackForm;
