import React from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {},
    card: {
        display: 'flex',
        flexDirection: 'row',
    },
});

const EventCard = () => {
    const classes = useStyles();
    return (
        <Container>
            <Card>
                <CardContent className={classes.card}>
                    <Box>
                        <Typography variant="h1">hai!</Typography>
                    </Box>
                    <Box></Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default EventCard;