import React from 'react';
import { darkSwitchGrey } from '../../functions/util';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paragraph from '../shared/paragraph';
import Image from '../shared/image';
import PageWrapper from '../shared/page-wrapper';
import FeedbackForm from './feedback-form';

import data from '../../data.json';

/**
 * The about page, which displays information about the website,
 * and allows users to send feedback through a form.
 */
const About = () => {
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
                <FeedbackForm />
            </Container>
        </PageWrapper>
    );
};

export default About;
