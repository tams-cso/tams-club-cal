import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import makeStyles from '@mui/styles/makeStyles';
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
    location: {
        marginTop: 24,
        color: darkSwitchGrey(theme),
        fontSize: '0.9rem',
    },
    buttonCenter: {
        margin: 'auto',
    },
}));

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
    const classes = useStyles();

    const back = () => {
        const prevView = getParams('view');
        history.push(`/${prevView ? `?view=${prevView}` : ''}`);
    };

    useEffect(async () => {
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

    return (
        <React.Fragment>
            {error}
            {event === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container className={classes.root}>
                    <Title resource="events" name={event.name} />
                    <AddButton color="secondary" label="Event" path={`/edit/events?id=${event.id}`} edit />
                    <Card>
                        <CardContent>
                            <Box className={classes.gridRoot}>
                                <Box className={`${classes.gridSide} ${classes.gridLeft}`}>
                                    <Typography className={classes.eventType}>{capitalize(event.type)}</Typography>
                                    <Typography variant="h2" component="h1">
                                        {event.name}
                                    </Typography>
                                    <Typography variant="subtitle1" component="p" className={classes.eventClub}>
                                        {event.club}
                                    </Typography>
                                    <Typography variant="h3" gutterBottom className={classes.date}>
                                        {formatEventDate(event)}
                                    </Typography>
                                    {
                                        <Typography variant="h3" className={classes.date}>
                                            {formatEventTime(event, event.noEnd, true)}
                                        </Typography>
                                    }
                                    <Typography variant="h3" className={classes.location}>
                                        {event.location === 'none'
                                            ? null
                                            : 'Location: ' + data.rooms.find((d) => d.value === event.location).label}
                                    </Typography>
                                </Box>
                                <Hidden mdDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <Paragraph
                                    text={event.description}
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
        </React.Fragment>
    );
};

export default EventDisplay;
