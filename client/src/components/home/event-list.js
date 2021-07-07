import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { setEventList } from '../../redux/actions';
import { getSavedEventList } from '../../redux/selectors';
import { getEventList } from '../../functions/api';
import { isSameDate } from '../../functions/util';

import EventListSection from './event-list-section';
import Loading from '../shared/loading';

const useStyles = makeStyles({
    root: {
        overflowX: 'hidden',
        minHeight: '100vh',
    },
});

const EventList = () => {
    const dispatch = useDispatch();
    const eventList = useSelector(getSavedEventList);
    const [eventComponentList, setEventComponentList] = useState(<Loading />);

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (eventList !== null) return;
        const events = await getEventList();
        if (events.status !== 200) {
            setEventComponentList(
                <Loading error="true">
                    Could not get event data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }
        dispatch(setEventList(events.data));
    }, []);

    useEffect(() => {
        // Make sure event list is not empty/null
        if (eventList === null) return;
        else if (eventList.length === 0) {
            // Set text if the eventList is null
            setEventComponentList(
                <Typography variant="h6" component="h2">
                    No events planned...
                </Typography>
            );
            return;
        }

        // Split the events into groups
        let eventGroupList = [];
        let tempList = [];
        eventList.forEach((event, index) => {
            if (tempList.length > 0 && isSameDate(tempList[tempList.length - 1].start, event.start)) {
                tempList.push(event);
            } else {
                if (index !== 0) eventGroupList.push(tempList);
                tempList = [event];
            }
        });
        eventGroupList.push(tempList);

        // Map each group item to an EventListSection object
        setEventComponentList(eventGroupList.map((group, index) => <EventListSection eventList={group} key={index} />));
    }, [eventList]);

    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.root}>
            {eventComponentList}
        </Container>
    );
};

export default EventList;
