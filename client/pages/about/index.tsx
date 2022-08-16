import React from 'react';
import { darkSwitchGrey } from '../../src/util/cssUtil';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paragraph from '../../src/components/shared/paragraph';
import CustomImage from '../../src/components/shared/custom-image';
import PageWrapper from '../../src/components/shared/page-wrapper';
import FeedbackForm from '../../src/components/about/feedback-form';
import Changelog from '../../src/components/about/changelog';
import TitleMeta from '../../src/components/meta/title-meta';
import HowToUse from '../../src/components/about/how-to-use';

import data from '../../src/data.json';

// Format for a section title
const sectionTitle = {
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: 500,
};

/**
 * The about page, which displays information about the website,
 * and allows users to send feedback through a form.
 */
const About = () => {
    return (
        <PageWrapper>
            <TitleMeta title="About" path="/about" />
            <Container>
                <CustomImage
                    src="/logo-banner.png"
                    alt="TAMS Club Calendar"
                    transparent
                    sx={{ margin: 'auto', marginBottom: 4, marginTop: 4 }}
                />
                <Paragraph text={data.aboutText} fontSize="1.1rem" sx={{ color: (theme) => darkSwitchGrey(theme) }} />
                <Typography variant="h2" sx={sectionTitle}>
                    Feedback
                </Typography>
                <Paragraph text={data.aboutFeedback} fontSize="1.1rem" />
                <FeedbackForm />
                <Typography variant="h2" sx={sectionTitle}>
                    How to Use (Read Me!) 
                </Typography>
                <HowToUse />
                <Typography variant="h2" sx={sectionTitle}>
                    Changelog
                </Typography>
                <Changelog />
            </Container>
        </PageWrapper>
    );
};

export default About;
