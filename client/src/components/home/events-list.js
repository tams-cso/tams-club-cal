import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DateSection from './date-section';

const useStyles = makeStyles({
    root: {

    },
    test: {
        backgroundColor: 'red',
        width: '100%',
        height: '2rem'
    }
})

const EventsList = () => {
    const classes = useStyles();

    return <Container maxWidth="lg">
        <DateSection></DateSection>
    </Container>
}

export default EventsList;