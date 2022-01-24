import React from 'react';
import type { Event } from '../../types';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DateSection from './date-section';
import ActivityEntry from './event-entry';

interface EventListSectionProps {
    /** List of events for this section (day) */
    activityList: Event[];
}

/**
 * A subsection of the events list, representing all the events happening on a single day.
 * This contains a list of elements with a date header.
 */
const EventListSection = (props: EventListSectionProps) => {
    return (
        <React.Fragment>
            <DateSection time={props.activityList[0].start} />
            <List>
                {props.activityList.map((activity, index) => {
                    return (
                        <React.Fragment key={index}>
                            {index === 0 ? null : <Divider variant="middle" />}
                            <ActivityEntry activity={activity} />
                        </React.Fragment>
                    );
                })}
            </List>
        </React.Fragment>
    );
};

export default EventListSection;
