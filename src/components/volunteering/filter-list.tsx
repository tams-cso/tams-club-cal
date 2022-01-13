import React from 'react';
import type { Filters } from '../../entries';

import List from '@mui/material/List';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import FilterItem from './filter-item';

interface FilterListProps {
    /** Object containing all the filters */
    filters: Filters;

    /** Format the List component */
    sx?: object;
}

/**
 * Show a list of filters for the volunteer list, each of which has
 * an icon and a specific color to denote that filter.
 * The specific filter will only be shown if it is true.
 */
const FilterList = (props: FilterListProps) => {
    return (
        <List dense sx={props.sx}>
            <FilterItem
                icon={<DashboardRoundedIcon htmlColor="#ffb258" />}
                color="#ffb258"
                status={props.filters.limited}
                name="Limited Spots"
            />
            <FilterItem
                icon={<EventNoteRoundedIcon htmlColor="#ff8b99" />}
                color="#ff8b99"
                status={props.filters.semester}
                name="Semester Long Committment"
            />
            <FilterItem
                icon={<ScheduleRoundedIcon htmlColor="#abb8ff" />}
                color="#abb8ff"
                status={props.filters.setTimes}
                name="Set Time Slots"
            />
            <FilterItem
                icon={<EventRoundedIcon htmlColor="#d38cff" />}
                color="#d38cff"
                status={props.filters.weekly}
                name="Repeats Weekly"
            />
        </List>
    );
};

export default FilterList;
