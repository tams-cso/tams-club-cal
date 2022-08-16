import React from 'react';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DateSection from './date-section';
import EventEntry from './event-entry';

interface EventListSectionProps {
    /** List of events for this section (day) */
    eventList: CalEvent[];
}

/**
 * A subsection of the events list, representing all the events happening on a single day.
 * This contains a list of elements with a date header.
 */
const EventListSection = (props: EventListSectionProps) => {
    return (
        <React.Fragment>
            <DateSection time={props.eventList[0].start} />
            <List>
                {props.eventList.map((event, index) => {
                    return (
                        <React.Fragment key={index}>
                            {index === 0 ? null : <Divider variant="middle" />}
                            <EventEntry event={event} />
                        </React.Fragment>
                    );
                })}
            </List>
        </React.Fragment>
    );
};

export default EventListSection;
