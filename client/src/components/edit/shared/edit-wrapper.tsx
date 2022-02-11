import React from 'react';

import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import PageWrapper from '../../shared/page-wrapper';
import EditLogin from './edit-login';

/**
 * Wraps history components, giving margins and padding, as well
 * as showing all content on a paper container, with the EditLogin component on top
 */
const EditWrapper = (props: React.HTMLProps<HTMLDivElement>) => {
    return (
        <PageWrapper>
            <Container>
                <Paper sx={{ paddingBottom: 3, marginBottom: 4 }}>
                    <EditLogin />
                    {props.children}
                </Paper>
            </Container>
        </PageWrapper>
    );
};

export default EditWrapper;
