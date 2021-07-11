import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paragraph from '../shared/paragraph';
import { getSavedEventList } from '../../redux/selectors';
import { darkSwitch, formatEventDate, formatEventTime } from '../../functions/util';
import { getEvent } from '../../functions/api';

import Loading from '../shared/loading';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
        },
    },
    gridRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    gridSide: {
        width: '50%',
        textAlign: 'left',
    },
    gridLeft: {
        padding: 8,
    },
    gridRight: {
        marginLeft: 12,
        padding: '8px 0',
    },
    eventClub: {
        marginBottom: 16,
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]),
    },
    eventType: {
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.secondary.main),
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
    const eventList = useSelector(getSavedEventList);
    const classes = useStyles();

    useEffect(async () => {
        if (props.id === null) return;

        // Check if the event list exists to pull from
        // If not, then pull the event from the backend
        let event = null;
        if (eventList === null) {
            const res = await getEvent(props.id);
            if (res.status === 200) event = res.data;
        } else {
            const foundEvent = eventList.find((e) => e.id === props.id);
            if (foundEvent !== undefined) event = foundEvent;
        }

        // Save the event or set an error if invalid ID
        if (event === null) {
            setError(
                <Loading error>
                    Invalid event ID. Please return to the events list page to refresh the content
                </Loading>
            );
        } else setEvent(event);
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
                                    <Typography variant="h3" gutterBottom>
                                        {formatEventDate(event)}
                                    </Typography>
                                    <Typography variant="h3">{formatEventTime(event)}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Paragraph
                                    text={event.description}
                                    className={`${classes.gridSide} ${classes.gridRight}`}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="medium" className={classes.buttonCenter}>
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                </Container>
            )}
        </React.Fragment>
    );
};

export default EventDisplay;
