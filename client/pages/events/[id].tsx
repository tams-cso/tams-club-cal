import React from 'react';
import type { Theme } from '@mui/material';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { RepeatingStatus } from '../../src/types';
import {
    darkSwitch,
    darkSwitchGrey,
    formatActivityDate,
    formatActivityTime,
    formatDate,
    getParams,
} from '../../src/util';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import Paragraph from '../../src/components/shared/paragraph';
import AddButton from '../../src/components/shared/add-button';
import Loading from '../../src/components/shared/loading';
import HomeBase from '../../src/components/home/home-base';
import { getEvent } from '../../src/api';

import data from '../../src/data.json';

// Coloring for the event type
const eventTypeStyle = {
    color: (theme: Theme) => darkSwitch(theme, theme.palette.grey[600], theme.palette.secondary.main),
};

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const eventRes = await getEvent(ctx.params.id as string);
    return {
        props: { event: eventRes.data, error: eventRes.status !== 200 },
    };
};

/**
 * Displays a single event in a card view
 */
const EventDisplay = ({ event, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    // Go back to the previous screen that took the user here
    // If a specific view was passed in, go back to that view
    const back = () => {
        const prevView = getParams('view');
        router.push(`/${prevView ? `events/${prevView}` : ''}`);
    };

    // Show error message if errored
    // TODO: Differentiate between invalid ID error and could not connect error
    if (error) {
        return (
            <HomeBase title={`Events`}>
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get event data. Make sure the ID you have is valid and reload the page.
                </Loading>
            </HomeBase>
        );
    }

    const location = data.rooms.find((d) => d.value === event.location);
    const reserved = event.reservation ? ' (Reserved)' : '';

    return (
        <HomeBase title={`${event.name} | Events`} noActionBar>
            <Container maxWidth={false} sx={{ maxWidth: { lg: '60%', md: '75%', xs: '100%' } }}>
                <AddButton color="secondary" label="Event" path={`/edit/events/${event.id}`} edit />
                <Card sx={{ marginBottom: 3 }}>
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
                                <Typography sx={eventTypeStyle}>{event.type}</Typography>
                                <Typography variant="h2" component="h1">
                                    {event.name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    component="p"
                                    sx={{ marginBottom: 4, color: (theme) => darkSwitchGrey(theme) }}
                                >
                                    {event.club}
                                </Typography>
                                <Typography variant="h3" gutterBottom sx={{ fontWeight: 400 }}>
                                    {formatActivityDate(event)}
                                </Typography>
                                <Typography variant="h3" gutterBottom sx={{ fontWeight: 400 }}>
                                    {formatActivityTime(event, event.noEnd, true)}
                                </Typography>
                                {event.repeats !== RepeatingStatus.NONE ? (
                                    <Typography
                                        variant="h3"
                                        sx={{ color: (theme) => darkSwitchGrey(theme), fontWeight: 400, marginTop: 2 }}
                                    >
                                        {`Repeats ${
                                            event.repeats === RepeatingStatus.WEEKLY ? 'weekly' : 'monthly'
                                        } until ${formatDate(event.repeatsUntil, 'dddd, MMMM D, YYYY')}`}
                                    </Typography>
                                ) : null}
                                <Typography
                                    variant="h3"
                                    sx={{
                                        marginTop: 6,
                                        color: (theme) => darkSwitchGrey(theme),
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {event.location === 'none'
                                        ? null
                                        : `Location: ${location ? location.label : event.location}${reserved}`}
                                </Typography>
                            </Box>
                            <Hidden mdDown>
                                <Divider orientation="vertical" flexItem />
                            </Hidden>
                            <Hidden mdUp>
                                <Divider orientation="horizontal" flexItem sx={{ marginTop: 2 }} />
                            </Hidden>
                            <Paragraph
                                text={event.description === '' ? '[No Description]' : event.description}
                                sx={{
                                    width: { lg: '50%', xs: '100%' },
                                    textAlign: 'left',
                                    margin: { lg: '0 0 0 12px', xs: '16px 0 0 0' },
                                    padding: { lg: '8px 0', xs: 0 },
                                    color: (theme: Theme) =>
                                        darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[200]),
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

export default EventDisplay;
