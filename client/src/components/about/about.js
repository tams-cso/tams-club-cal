import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { postFeedback } from '../../functions/api';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Paragraph from '../shared/paragraph';
import Image from '../shared/image';
import data from '../../data.json';
import { Feedback } from '../../functions/entries';

const useStyles = makeStyles({
    root: {
        paddingTop: 16,
    },
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
        <Container className={classes.root}>
            <Image src="/logo-banner.png" alt="TAMS Club Calendar" className={classes.image}></Image>
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
    );
};

export default About;
