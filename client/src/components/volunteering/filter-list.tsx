import React from 'react';
import { useTheme } from '@mui/material';

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
    const theme = useTheme();
    const colors =
        theme.palette.mode === 'light'
            ? ['#ff9f32', '#ff6677', '#8496ff', '#c466ff']
            : ['#ffb258', '#ff8b99', '#abb8ff', '#d38cff'];

    return (
        <List dense sx={props.sx}>
            <FilterItem
                icon={<DashboardRoundedIcon htmlColor={colors[0]} />}
                color={colors[0]}
                status={props.filters.limited}
                name="Limited Spots"
            />
            <FilterItem
                icon={<EventNoteRoundedIcon htmlColor={colors[1]} />}
                color={colors[1]}
                status={props.filters.semester}
                name="Semester Long Committment"
            />
            <FilterItem
                icon={<ScheduleRoundedIcon htmlColor={colors[2]} />}
                color={colors[2]}
                status={props.filters.setTimes}
                name="Set Time Slots"
            />
            <FilterItem
                icon={<EventRoundedIcon htmlColor={colors[3]} />}
                color={colors[3]}
                status={props.filters.weekly}
                name="Repeats Weekly"
            />
        </List>
    );
};

export default FilterList;
