import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { postFeedback } from '../../api';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ControlledTextField from '../edit/shared/controlled-text-field';
import FormWrapper from '../edit/shared/form-wrapper';
import UploadBackdrop from '../edit/shared/upload-backdrop';
import Popup from '../shared/popup';

/**
 * Feedback form for About page
 */
const FeedbackForm = () => {
    const [backdrop, setBackdrop] = useState(false);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>(null);
    const { register, control, handleSubmit, setValue, setError } = useForm();

    const onSubmit = async (data) => {
        // Make sure feedback isn't just spaces lol
        if (data.feedback.trim().length === 0) {
            setError('feedback', { message: 'Feedback is empty' });
            return;
        }

        // Start the upload process
        setBackdrop(true);

        // Create feedback object and send POST request to server
        const name = data.name ? data.name.trim() : '';
        const feedback = { id: null, feedback: data.feedback.trim(), name, time: new Date().valueOf() } as Feedback;
        const res = await postFeedback(feedback);

        // Finished uploading
        setBackdrop(false);

        // Check if feedback was successfully sent and send message to user
        if (res.status == 204) {
            setValue('feedback', '');
            setValue('name', '');
            setPopupEvent({ severity: 2, message: 'Feedback successfully submitted!', time: new Date().valueOf() });
        } else setPopupEvent({ severity: 4, message: 'Error submitting feedback', time: new Date().valueOf() });
    };

    return (
        <React.Fragment>
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <ControlledTextField
                    control={control}
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
