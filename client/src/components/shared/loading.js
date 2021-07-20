import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    card: {
        margin: '0 20%',
        padding: '1rem',
        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },
    },
    text: {
        textAlign: 'center',
    },
}));

/**
 * Loading screen for all data, as well as an error message display
 * if the error field is defined.
 *
 * @param {object} props React props object
 * @param {boolean} props.error If true, shows error message
 * @param {string} props.children The error message
 * @param {boolean} [props.flat] True for no elevation
 */
const Loading = (props) => {
    const classes = useStyles();
    return (
        <Container>
            <Card elevation={props.flat ? 0 : 2} className={classes.card}>
                {props.error ? (
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
