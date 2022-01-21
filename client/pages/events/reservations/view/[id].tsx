import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dayjs from 'dayjs';
import type { Theme } from '@mui/material';
import { darkSwitch, darkSwitchGrey, formatEventDate, formatEventTime } from '../../../../src/util';
import { getRepeatingReservation, getReservation } from '../../../../src/api';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import HomeBase from '../../../../src/components/home/home-base';
import Paragraph from '../../../../src/components/shared/paragraph';
import Loading from '../../../../src/components/shared/loading';
import AddButton from '../../../../src/components/shared/add-button';
import Title from '../../../../src/components/shared/title';

import data from '../../../../src/data.json';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const repeating = ctx.query.repeating;
    const reservationRes = repeating
        ? await getRepeatingReservation(ctx.params.id as string)
        : await getReservation(ctx.params.id as string);
    return {
        props: { reservation: reservationRes.data, error: reservationRes.status !== 200 },
    };
};

/**
 * Displays a single reservation, with the ID passed in the URL
 */
const ReservationDisplay = ({ reservation, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Return to the reservation list on click
    const back = () => {
        router.push('/events/reservations');
    };

    // Show error message if errored
    if (error) {
        return (
            <HomeBase title={`Events`}>
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get reservation data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </HomeBase>
        );
    }

    return (
        <HomeBase noActionBar noDrawer>
            <Container maxWidth={false} sx={{ maxWidth: { lg: '50%', md: '75%', xs: '100%' } }}>
                <Title resource="reservations" name={reservation.name} />
                <AddButton
                    color="secondary"
                    label={reservation.eventId ? 'Event' : 'Reservation'}
                    path={
                        reservation.eventId
                            ? `/edit/events/${reservation.eventId}`
                            : `/edit/reservations/${reservation.id}${reservation.repeatEnd ? '?repeating=true' : ''}`
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
                            <Hidden mdUp>
                                <Divider orientation="horizontal" flexItem sx={{ marginTop: 2 }} />
                            </Hidden>
                            <Paragraph
                                text={reservation.description === '' ? '[No Description]' : reservation.description}
                                sx={{
                                    width: { lg: '50%', xs: '100%' },
                                    textAlign: 'left',
                                    margin: { lg: '0 0 0 12px', xs: '16px 0 0 0' },
                                    padding: { lg: '8px 0', xs: 0 },
                                    color: (theme: Theme) => darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[200])
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
        </HomeBase>
    );
};

export default ReservationDisplay;
