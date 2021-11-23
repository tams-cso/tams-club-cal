import React from 'react';
import { Filters } from '../../functions/entries';

import List from '@mui/material/List';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import FilterItem from './filter-item';

/**
 * @param {object} props React props object
 * @param {Filters} props.filters Object containing all the filters
 * @returns
 */
const FilterList = (props) => {
    return (
        <List dense className={props.className || ''}>
            <FilterItem
                icon={<DashboardRoundedIcon htmlColor="#ffb258" />}
                color="#ffb258"
                status={props.filters.limited}
            >
                Limited Spots
            </FilterItem>
            <FilterItem
                icon={<EventNoteRoundedIcon htmlColor="#ff8b99" />}
                color="#ff8b99"
                status={props.filters.semester}
            >
                Semester Long Committment
            </FilterItem>
            <FilterItem
                icon={<ScheduleRoundedIcon htmlColor="#abb8ff" />}
                color="#abb8ff"
                status={props.filters.setTimes}
            >
                Set Time Slots
            </FilterItem>
            <FilterItem icon={<EventRoundedIcon htmlColor="#d38cff" />} color="#d38cff" status={props.filters.weekly}>
                Repeats Weekly
            </FilterItem>
        </List>
    );
};

export default FilterList;
