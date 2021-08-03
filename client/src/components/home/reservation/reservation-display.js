import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { darkSwitch, darkSwitchGrey, formatEventDate, formatEventTime, getParams } from '../../../functions/util';
import { getReservation } from '../../../functions/api';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Paragraph from '../../shared/paragraph';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';
import PageWrapper from '../../shared/page-wrapper';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down(1500)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
        },
    },
    gridRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    gridSide: {
        width: '50%',
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    gridLeft: {
        padding: 8,
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    gridRight: {
        marginLeft: 12,
        padding: '8px 0',
        [theme.breakpoints.down('sm')]: {
            margin: 0,
            marginTop: 16,
            padding: 0,
        },
    },
    eventClub: {
        marginBottom: 16,
        color: darkSwitchGrey(theme),
    },
    eventType: {
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.secondary.main),
    },
    date: {
        fontWeight: 400,
    },
    buttonCenter: {
        margin: 'auto',
    },
}));

const ReservationDisplay = () => {
    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();
    const classes = useStyles();

    const back = () => {
        history.push('/?view=reservation');
    };

    useEffect(async () => {
        const id = getParams('id');
        if (!id) {
            setError(<Loading error>No ID found. Please return to the home page.</Loading>);
            return;
        }

        // Pull the event from the backend
        const res = await getReservation(id);
        if (res.status !== 200) {
            setError(
                <Loading error>
                    Invalid reservation ID. Please return to the reservations list page to refresh the content
                </Loading>
            );
        } else setReservation(res.data);
    }, []);

    return (
        <PageWrapper>
            {error}
            {reservation === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container className={classes.root}>
                    <AddButton color="secondary" path={`/edit/events?id=${reservation.id}`} edit />
                    <Card>
                        <CardContent>
                            <Box className={classes.gridRoot}>
                                <Box className={`${classes.gridSide} ${classes.gridLeft}`}>
                                    <Typography variant="h2" component="h1">
                                        {reservation.name}
                                    </Typography>
                                    <Typography variant="subtitle1" component="p" className={classes.eventClub}>
                                        {reservation.club}
                                    </Typography>
                                    <Typography variant="h3" gutterBottom className={classes.date}>
                                        {formatEventDate(reservation)}
                                    </Typography>
                                    <Typography variant="h3" className={classes.date}>
                                        {formatEventTime(reservation)}
                                    </Typography>
                                </Box>
                                <Hidden smDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <Paragraph
                                    text={reservation.description}
                                    className={`${classes.gridSide} ${classes.gridRight}`}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="small" className={classes.buttonCenter} onClick={back}>
                                Back
                            </Button>
                        </CardActions>
                    </Card>
                </Container>
            )}
        </PageWrapper>
    );
};

export default ReservationDisplay;
