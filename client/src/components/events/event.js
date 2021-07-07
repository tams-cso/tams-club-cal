import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { getSavedEventList } from '../../redux/selectors';
import { getParams } from '../../functions/util';

import HomeDrawer from '../home/home-drawer';
import Loading from '../shared/loading';
import { getEvent } from '../../functions/api';
import EventCard from './event-card';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        paddingTop: '1rem',
    },
});

const Event = () => {
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();
    const eventList = useSelector(getSavedEventList);

    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // Return the user to the home page if missing and ID
        if (id === null) {
            history.push('/');
            return;
        }

        // Check if the event list exists to pull from
        // If not, then pull the event from the backend
        let event = null;
        if (eventList === null) {
            const res = await getEvent(id);
            if (res.status === 200) event = res.data;
        } else {
            const foundEvent = eventList.find((e) => e.id === id);
            if (foundEvent !== undefined) event = foundEvent;
        }

        // Save the event or set an error if invalid ID
        if (event === null) {
            setError(
                <Loading error="true">
                    Invalid event ID. Please return to the events list page to refresh the content
                </Loading>
            );
        } else setEvent(event);
    }, []);

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <HomeDrawer />
            {error}
            {event === null ? <Loading /> : <EventCard event={event} />}
        </div>
    );
};

export default Event;
