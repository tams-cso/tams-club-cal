import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import { setEventList } from '../../../redux/actions';
import { getSavedEventList } from '../../../redux/selectors';
import { getEventList, getMoreEvents } from '../../../functions/api';
import { darkSwitchGrey, isSameDate } from '../../../functions/util';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EventListSection from './event-list-section';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: 'hidden',
        minHeight: '100vh',
    },
    centerButton: {
        margin: 'auto',
        width: '100%',
    },
    noMore: {
        textAlign: 'center',
        color: darkSwitchGrey(theme),
        marginTop: 12,
    },
}));

const EventList = () => {
    const dispatch = useDispatch();
    const eventList = useSelector(getSavedEventList);
    const [eventComponentList, setEventComponentList] = useState(<Loading />);
    const classes = useStyles();

    const loadMore = async () => {
        const lastId = eventList[eventList.length - 1].id;
        const newEvents = await getMoreEvents(lastId);
        dispatch(setEventList([...eventList, ...newEvents]));
    };

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (eventList !== null) return;
        const events = await getEventList();
        if (events.status !== 200) {
            setEventComponentList(
                <Loading error>
                    Could not get event data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }
        const filteredList = events.data
            .sort((a, b) => a.start - b.start)
            .filter((e) => e.start >= dayjs().startOf('day'));
        dispatch(setEventList(filteredList));
    }, []);

    useEffect(() => {
        // Make sure event list is not empty/null
        if (eventList === null) return;
        else if (eventList.length === 0) {
            // Set text if the eventList is null
            setEventComponentList(
                <Typography variant="h6" component="h2" className={classes.noMore}>
                    No events planned... Click the + to add one!
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
        const groupedComponents = eventGroupList.map((group, index) => (
            <EventListSection eventList={group} key={index} />
        ));

        // If event list is not full, add button to retrieve more events
        if (eventList.length !== 0 && eventList.length % 30 === 0)
            groupedComponents.push(
                <Button className={classes.centerButton} onClick={loadMore} key="load">
                    Load more events
                </Button>
            );
        else
            groupedComponents.push(
                <Typography className={classes.noMore} key="nomore">
                    No more events... Click the + to add one!
                </Typography>
            );

        // Display list
        setEventComponentList(groupedComponents);
    }, [eventList]);

    return (
        <Container maxWidth="lg" className={classes.root}>
            <AddButton color="primary" path="/edit/events" />
            {eventComponentList}
        </Container>
    );
};

export default EventList;
