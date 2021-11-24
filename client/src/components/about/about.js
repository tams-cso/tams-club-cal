import React, { useState } from 'react';
import { postFeedback } from '../../functions/api';
import { Feedback } from '../../functions/entries';
import { darkSwitchGrey } from '../../functions/util';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Paragraph from '../shared/paragraph';
import Image from '../shared/image';
import PageWrapper from '../shared/page-wrapper';

import data from '../../data.json';

// Style the text field component
const textFieldStyle = {
    width: '100%',
    margin: '16px 0 8px',
};

/**
 * The about page, which displays information about the website,
 * and allows users to send feedback through a form.
 */
const About = () => {
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    // Handle change in form field (feedback and name)
    const handleChange = (event) => {
        switch (event.target.id) {
            case 'feedback':
                setFeedback(event.target.value);
                break;
            case 'name':
                setName(event.target.value);
                break;
        }
    };

    // Handle form submit button click by trimming string
    // then sending feedback to database if not empty
    const handleSubmit = async () => {
        if (feedback.trim().length === 0) {
            setError(true);
            return;
        }

        const feedback = new Feedback(feedback.trim(), name.trim(), new Date().valueOf());
        const res = await postFeedback(feedback);

        if (res.status == 200) {
            setFeedback('');
            setName('');
            alert('Thank you for your feedback!');
        } else alert('Could not submit feedback :(');
    };

    return (
        <PageWrapper title="About">
            <Container>
                <Image
                    src="/logo-banner.png"
                    alt="TAMS Club Calendar"
                    transparent
                    sx={{ margin: 'auto', marginBottom: 4, marginTop: 4 }}
                />
                <Paragraph text={data.aboutText} fontSize="1.1rem" sx={{ color: (theme) => darkSwitchGrey(theme)} } />
                <Typography
                    variant="h2"
                    sx={{
                        marginTop: 8,
                        marginBottom: 2,
                        textAlign: 'center',
                        fontWeight: 500,
                    }}
                >
                    Feedback
                </Typography>
                <Paragraph text={data.aboutFeedback} fontSize="1.1rem" />
                {/* TODO: Replace this with a React Hook Form!!! */}
                <form noValidate autoComplete="off">
                    <TextField
                        id="feedback"
                        label="Feedback"
                        multiline
                        variant="outlined"
                        value={feedback}
                        onChange={handleChange}
                        error={error}
                        helperText={error ? 'Feedback cannot be empty' : ''}
                        sx={textFieldStyle}
                    ></TextField>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="name"
                            label="Name (optional)"
                            value={name}
                            onChange={handleChange}
                            sx={textFieldStyle}
                        ></TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </form>
            </Container>
        </PageWrapper>
    );
};

export default About;
