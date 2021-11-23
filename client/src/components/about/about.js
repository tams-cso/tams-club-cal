import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { postFeedback } from '../../functions/api';
import { Feedback } from '../../functions/entries';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Paragraph from '../shared/paragraph';
import Image from '../shared/image';

import data from '../../data.json';
import PageWrapper from '../shared/page-wrapper';

const useStyles = makeStyles({
    image: {
        margin: 'auto',
        marginBottom: 16,
    },
    center: {
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 8,
    },
    area: {
        width: '100%',
        margin: '16px 0 8px',
    },
    submitWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    field: {
        flexGrow: 1,
        marginRight: 12,
    },
});

const About = () => {
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const classes = useStyles();

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
                <Image src="/logo-banner.png" alt="TAMS Club Calendar" className={classes.image} transparent />
                <Paragraph text={data.aboutText} fontSize="1.1rem" />
                <Typography variant="h2" className={classes.center}>
                    Feedback
                </Typography>
                <Paragraph text={data.aboutFeedback} fontSize="1.1rem" />
                <form className={classes.form} noValidate autoComplete="off">
                    <TextField
                        id="feedback"
                        label="Feedback"
                        multiline
                        variant="outlined"
                        value={feedback}
                        onChange={handleChange}
                        className={classes.area}
                        error={error}
                        helperText={error ? 'Feedback cannot be empty' : ''}
                    ></TextField>
                    <Box className={classes.submitWrapper}>
                        <TextField
                            id="name"
                            label="Name (optional)"
                            value={name}
                            onChange={handleChange}
                            className={classes.field}
                        ></TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.submit}
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
