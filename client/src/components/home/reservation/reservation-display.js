import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import { darkSwitchGrey, formatEventDate, formatEventTime, getParams } from '../../../functions/util';
import { getRepeatingReservation, getReservation } from '../../../functions/api';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import Paragraph from '../../shared/paragraph';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';
import PageWrapper from '../../shared/page-wrapper';

import data from '../../../data.json';
import Title from '../../shared/title';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down(undefined)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down('lg')]: {
            maxWidth: '100%',
        },
    },
    gridRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    gridSide: {
        width: '50%',
        textAlign: 'left',
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    },
    gridLeft: {
        padding: 8,
        [theme.breakpoints.down('md')]: {
            padding: 0,
        },
    },
    gridRight: {
        marginLeft: 12,
        padding: '8px 0',
        [theme.breakpoints.down('md')]: {
            margin: 0,
            marginTop: 16,
            padding: 0,
        },
    },
    location: {
        marginBottom: 12,
        color: darkSwitchGrey(theme),
        fontSize: '0.9rem',
    },
    club: {
        marginBottom: 16,
        color: darkSwitchGrey(theme),
    },
    date: {
        fontWeight: 400,
    },
    repeat: {
        marginTop: 24,
        fontSize: '1rem',
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
        const repeating = getParams('repeating');

        // Pull the event from the backend
        const res = repeating ? await getRepeatingReservation(id) : await getReservation(id);
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
                    <Title resource="reservations" name={reservation.name} />
                    <AddButton
                        color="secondary"
                        label={reservation.eventId ? 'Event' : 'Reservation'}
                        path={
                            reservation.eventId
                                ? `/edit/events?id=${reservation.eventId}`
                                : `/edit/reservations?id=${reservation.id}${
                                      reservation.repeatEnd ? '&repeating=true' : ''
                                  }`
                        }
                        edit
                    />
                    <Card>
                        <CardContent>
                            <Box className={classes.gridRoot}>
                                <Box className={`${classes.gridSide} ${classes.gridLeft}`}>
                                    <Typography variant="h3" className={classes.location}>
                                        {'Location: ' + data.rooms.find((d) => d.value === reservation.location).label}
                                    </Typography>
                                    <Typography variant="h2" component="h1">
                                        {reservation.name}
                                    </Typography>
                                    <Typography variant="subtitle1" component="p" className={classes.club}>
                                        {reservation.club}
                                    </Typography>
                                    <Typography variant="h3" gutterBottom className={classes.date}>
                                        {formatEventDate(reservation)}
                                    </Typography>
                                    <Typography variant="h3" className={classes.date}>
                                        {formatEventTime(reservation, false, true)}
                                    </Typography>
                                    {reservation.repeatEnd ? (
                                        <Typography variant="h3" className={classes.repeat}>
                                            {'Repeats Until: ' + dayjs(reservation.repeatEnd).format('MMMM D, YYYY')}
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Hidden mdDown>
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
