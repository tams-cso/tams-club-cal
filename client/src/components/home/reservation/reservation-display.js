import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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
import Title from '../../shared/title';

import data from '../../../data.json';

/**
 * Displays a single reservation, with the ID passed in the URL
 */
const ReservationDisplay = () => {
    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();

    // On mount, get the reservation data from url param ID
    useEffect(async () => {
        const id = getParams('id');

        // If the ID is invalid or missing, set an error
        if (!id) {
            setError(<Loading error>No ID found. Please return to the home page.</Loading>);
            return;
        }

        // Check to see if the reservation is a repeating reservation
        const repeating = getParams('repeating');

        // Pull the event from the backend
        // If it is repeating, fetch from the repeating reservation database
        // Set an error or set the reservation state variable if no error
        const res = repeating ? await getRepeatingReservation(id) : await getReservation(id);
        if (res.status !== 200) {
            setError(
                <Loading error>
                    Invalid reservation ID. Please return to the reservations list page to refresh the content
                </Loading>
            );
        } else setReservation(res.data);
    }, []);

    // Return to the reservation list on click
    const back = () => {
        history.push('/?view=reservation');
    };

    return (
        <PageWrapper>
            {error}
            {reservation === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container maxWidth={false} sx={{ maxWidth: { md: '75%', xs: '100%' } }}>
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
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: { lg: 'row', xs: 'column' },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { lg: '50%', xs: '100%' },
                                        textAlign: 'left',
                                        padding: { lg: 1, xs: 0 },
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            marginBottom: 3,
                                            color: (theme) => darkSwitchGrey(theme),
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {'Location: ' + data.rooms.find((d) => d.value === reservation.location).label}
                                    </Typography>
                                    <Typography variant="h2" component="h1">
                                        {reservation.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        component="p"
                                        sx={{ marginBottom: 4, color: (theme) => darkSwitchGrey(theme) }}
                                    >
                                        {reservation.club}
                                    </Typography>
                                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 400 }}>
                                        {formatEventDate(reservation)}
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 400 }}>
                                        {formatEventTime(reservation, false, true)}
                                    </Typography>
                                    {reservation.repeatEnd ? (
                                        <Typography variant="h3" sx={{ marginTop: 6, fontSize: '1rem' }}>
                                            {'Repeats Until: ' + dayjs(reservation.repeatEnd).format('MMMM D, YYYY')}
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Hidden mdDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <Paragraph
                                    text={reservation.description}
                                    sx={{
                                        width: { lg: '50%', xs: '100%' },
                                        textAlign: 'left',
                                        margin: { lg: '0 0 0 12px', xs: '16px 0 0 0' },
                                        padding: { lg: '8px 0', xs: 0 },
                                    }}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={back} sx={{ margin: 'auto' }}>
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
