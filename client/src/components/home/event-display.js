import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { capitalize } from '@mui/material';
import { darkSwitch, darkSwitchGrey, formatEventDate, formatEventTime, getParams } from '../../functions/util';
import { getEvent } from '../../functions/api';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import Paragraph from '../shared/paragraph';
import Loading from '../shared/loading';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

import data from '../../data.json';

// Coloring for the event type
const eventTypeStyle = {
    color: (theme) => darkSwitch(theme, theme.palette.grey[600], theme.palette.secondary.main),
};

/**
 * Displays a single event.
 * This component takes in the event ID as a parameter.
 *
 * @param {object} props React props object
 * @param {string} props.id ID of the event
 */
const EventDisplay = (props) => {
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();

    // Get the event from the database and set the state variable or error
    useEffect(async () => {
        // If the event ID is not in the URL, do nothing
        if (props.id === null) return;

        // Pull the event from the backend
        const res = await getEvent(props.id);

        // Save the event or set an error if invalid ID
        if (res.status !== 200) {
            setError(
                <Loading error>Invalid event ID. Please return to the events list page to refresh the content</Loading>
            );
        } else setEvent(res.data);
    }, [props.id]);

    // Go back to the previous screen that took the user here
    // If a specific view was passed in, go back to that view
    const back = () => {
        const prevView = getParams('view');
        history.push(`/${prevView ? `?view=${prevView}` : ''}`);
    };

    return (
        <React.Fragment>
            {error}
            {event === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container maxWidth={false} sx={{ maxWidth: { lg: '60%', md: '75%', xs: '100%' } }}>
                    <Title resource="events" name={event.name} />
                    <AddButton color="secondary" label="Event" path={`/edit/events?id=${event.id}`} edit />
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
                                    <Typography sx={eventTypeStyle}>
                                        {event.type === 'event' ? 'Event' : 'Signup/Deadline'}
                                    </Typography>
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
                                        {formatEventDate(event)}
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 400 }}>
                                        {formatEventTime(event, event.noEnd, true)}
                                    </Typography>
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
                                            : 'Location: ' +
                                              data.rooms.find((d) => d.value === event.location).label +
                                              (event.reservationId ? ' (Reserved)' : '')}
                                    </Typography>
                                </Box>
                                <Hidden mdDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <Paragraph
                                    text={event.description === '' ? '[No Description]' : event.description}
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
        </React.Fragment>
    );
};

export default EventDisplay;
