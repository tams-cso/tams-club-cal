import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    card: {
        margin: '0 20%',
        padding: '1rem',
    },
    text: {
        textAlign: 'center',
    },
});

/**
 * Loading screen for all data, as well as an error message display
 * if the error field is defined.
 * 
 * @param {object} props React props object
 * @param {string} props.error If true, shows error message
 */
const Loading = (props) => {
    const classes = useStyles();
    return (
        <Container>
            <Card elevation={2} className={classes.card}>
                {props.error !== undefined ? (
                    <React.Fragment>
                        <Typography variant="h1" className={classes.text}>
                            ERROR :(
                        </Typography>
                        <Typography className={classes.text}>{props.children}</Typography>
                    </React.Fragment>
                ) : (
                    <Typography variant="h1" className={classes.text}>
                        Loading...
                    </Typography>
                )}
            </Card>
        </Container>
    );
};

export default Loading;
