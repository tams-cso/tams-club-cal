import React from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { Event } from '../../functions/entries';

const useStyles = makeStyles({
    root: {},
    card: {
        display: 'flex',
        flexDirection: 'row',
    },
});

/**
 * An event entry on the home page events list
 *
 * @param {object} props The react properties
 * @param {Event} props.event The events object
 */
const EventCard = (props) => {
    const classes = useStyles();
    return (
        <Container>
            <Card>
                <CardContent className={classes.card}>
                    <Box>
                        <Typography variant="h1">{props.event.name}</Typography>
                    </Box>
                    <Box></Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default EventCard;