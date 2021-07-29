import React from 'react';
import { Event } from '../../../functions/entries';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DateSection from './date-section';
import EventEntry from './event-entry';

/**
 * A subsection of the events list, representing all the events happening on a single day.
 * This contains a list of elements with a date header.
 *
 * @param {object} props React props object
 * @param {Event[]} props.eventList List of events for this section
 */
const EventListSection = (props) => {
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
