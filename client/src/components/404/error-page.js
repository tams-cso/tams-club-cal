import React from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        marginTop: '10rem',
    },
    text: {
        textAlign: 'center',
    },
});

const ErrorPage = () => {
    const classes = useStyles();
    return (
        <Container className={classes.root}>
            <Card>
                <CardContent className={classes.text}>
                    <Typography variant="h1">404</Typography>
                    <Typography>
                        There was an error with loading the data :(( Please contact the website developers to resolve
                        this issue. See the about page for more contact info.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ErrorPage;
