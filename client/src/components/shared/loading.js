import React from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        width: 'min-content',
        margin: 'auto',
        padding: '1rem',
    },
    text: {
        textAlign: 'center',
    },
});

const Loading = () => {
    const classes = useStyles();
    return (
        <Container>
            <Card elevation={2} className={classes.card}>
                <Typography variant="h2" className={classes.text}>
                    Loading...
                </Typography>
            </Card>
        </Container>
    );
};

export default Loading;
