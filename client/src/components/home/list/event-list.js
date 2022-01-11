import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getEventList, getMoreEvents } from '../../../functions/api';
import { darkSwitchGrey, isSameDate, parseEventList } from '../../../functions/util';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EventListSection from './event-list-section';
import Loading from '../../shared/loading';
import AddButton from '../../shared/add-button';

/**
 * The EventList component is responsible for displaying the list of events
 * on the home page in a schedule view. This component will fetch the events
 * and display future events, split by days.
 */
const EventList = () => {
    const [eventList, setEventList] = useState(null);
    const [eventComponentList, setEventComponentList] = useState(<Loading sx={{ marginBottom: 4 }} />);

    // Fetch the events list on mount from database
    useEffect(async () => {
        if (eventList !== null) return;
        const events = await getEventList();
        if (events.status !== 200) {
            setEventComponentList(
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get event data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }

        // Sort the events by date and filter out all elements
        // that do not start on or after the current date
        const filteredList = events.data
            .sort((a, b) => a.start - b.start)
            .filter((e) => e.start >= dayjs().startOf('day'));
        setEventList(filteredList);
    }, []);

    // This hook will first make sure the event list is not empty/null,
    // then it will call a util function to split up multi-day events,
    // group the events by date, and create a list of EventListSections,
    // each containing a list of events for that day.
    useEffect(() => {
        // Make sure event list is not null
        if (eventList === null) return;

        // Set text if the eventList is empty
        if (eventList.length === 0) {
            setEventComponentList(
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        marginTop: 3,
                        marginBottom: 6,
                        textAlign: 'center',
                        color: (theme) => darkSwitchGrey(theme),
                    }}
                >
                    No events planned... Click the + to add one!
                </Typography>
            );
            return;
        }

        // Split up multi-day events
        const parsedEventList = parseEventList(eventList);

        // Split the events into groups by date
        // TODO: Put this in a util function
        let eventGroupList = [];
        let tempList = [];
        parsedEventList.forEach((event, index) => {
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
        // TODO: What if the number of events is a multiple of 30??????
        if (eventList.length !== 0 && eventList.length % 30 === 0)
            groupedComponents.push(
                <Button onClick={loadMore} key="load" sx={{ margin: 'auto' }}>
                    Load more events
                </Button>
            );
        else
            groupedComponents.push(
                <Typography
                    key="nomore"
                    sx={{
                        marginTop: 3,
                        marginBottom: 8,
                        textAlign: 'center',
                        color: (theme) => darkSwitchGrey(theme),
                    }}
                >
                    No more events... Click the + to add one!
                </Typography>
            );

        // Display list
        setEventComponentList(groupedComponents);
    }, [eventList]);

    const loadMore = async () => {
        const lastId = eventList[eventList.length - 1].id;
        const newEvents = await getMoreEvents(lastId);
        setEventList([...eventList, ...newEvents]);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                height: 'max-content',
                overflowX: 'hidden',
            }}
        >
            <AddButton color="primary" label="Event" path="/edit/events" />
            {eventComponentList}
        </Container>
    );
};

export default EventList;
