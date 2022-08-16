import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import type { SxProps, Theme } from '@mui/material';
import dayjs from 'dayjs';
import { AccessLevelEnum } from '../src/types/enums';
import { getPublicEventList } from '../src/api';
import { getAccessLevel } from '../src/util/miscUtil';
import { parsePublicEventList } from '../src/util/dataParsing';
import { isSameDate } from '../src/util/datetime';
import { darkSwitchGrey } from '../src/util/cssUtil';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FilterListIcon from '@mui/icons-material/FilterList';
import HomeBase from '../src/components/home/home-base';
import Loading from '../src/components/shared/loading';
import AddButton from '../src/components/shared/add-button';
import EventListSection from '../src/components/home/event-list-section';
import TitleMeta from '../src/components/meta/title-meta';

// Format the no events/add more events text on the event list
const listTextFormat = {
    marginTop: 3,
    marginBottom: 8,
    textAlign: 'center',
    color: (theme) => darkSwitchGrey(theme),
} as SxProps<Theme>;

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const eventRes = await getPublicEventList();
    const level = await getAccessLevel(ctx);

    // Return error if bad data
    if (eventRes.status !== 200) return { props: { eventList: null, error: true, level: AccessLevelEnum.STANDARD } };

    // Sort the events by date and filter out all elements
    // that do not start on or after the current date
    const startOfToday = dayjs().startOf('day').valueOf();
    const filteredList = eventRes.data.sort((a, b) => a.start - b.start).filter((e) => e.start >= startOfToday);
    const parsedEventList = parsePublicEventList(filteredList);
    return {
        props: { eventList: parsedEventList, error: false, level },
    };
};

const Home = ({ eventList, error, level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [eventComponentList, setEventComponentList] = useState<JSX.Element | JSX.Element[]>(
        <Loading sx={{ marginBottom: 4 }} />
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        event: false,
        ga: false,
        meeting: false,
        volunteering: false,
        other: false,
    });

    // This hook will first make sure the event list is not empty/null,
    // then it will call a util function to split up multi-day events,
    // group the events by date, and create a list of EventListSections,
    // each containing a list of events for that day.
    useEffect(() => {
        // Make sure event list is not null
        if (error || eventList === null) return;

        // Set text to the end of the events list if empty
        if (eventList.length === 0) {
            setEventComponentList(
                <Typography variant="h6" component="h2" sx={listTextFormat}>
                    No events planned... Click the + to add one!
                </Typography>
            );
            return;
        }

        // Filter the event list
        const filteredEventList = eventList.filter((event) => {
            // If no filters selected, return true
            if (!(filters.event || filters.ga || filters.meeting || filters.volunteering || filters.other)) return true;

            return filters[event.type];
        });

        // Return if the list is empty
        if (filteredEventList.length === 0) {
            setEventComponentList([
                <Typography key="nomore" sx={listTextFormat}>
                    No events match the event type filter! Broaden your search or create a new event with the '+'!
                </Typography>,
            ]);
            return;
        }

        // Split the events into groups by date
        // TODO: Put this in a util function or not idk
        const eventGroupList = [];
        let tempList = [];
        filteredEventList.forEach((event, index) => {
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

        // No more message at the bottom!
        groupedComponents.push(
            <Typography key="nomore" sx={listTextFormat}>
                No more events... Click the + to add one!
            </Typography>
        );

        // Display list
        setEventComponentList(groupedComponents);
    }, [eventList, filters]);

    // Open the popup element on click
    // The setAchorEl is used for the Popover component
    const openFilters = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the popup element by setting the anchor element to null
    const closeFilters = () => {
        setAnchorEl(null);
    };

    // Toggle the filters open/closed when clicked
    const handleChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    };

    // Show error message if errored
    if (error) {
        return (
            <HomeBase title={`Events`}>
                <Loading error sx={{ marginBottom: 4 }}>
                    Could not get event list. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            </HomeBase>
        );
    }

    return (
        <HomeBase>
            <TitleMeta />
            <Container
                maxWidth="lg"
                sx={{
                    height: 'max-content',
                    overflowX: 'hidden',
                }}
            >
                <AddButton
                    color="primary"
                    label="Event"
                    path={level < AccessLevelEnum.STANDARD ? "/profile?prev=/edit/events" : "/edit/events"}
                />
                <Box width="100%" marginBottom={2} display="flex" alignItems="center">
                    <Tooltip title="Filters">
                        <IconButton onClick={openFilters} size="large">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography
                        sx={{
                            marginLeft: 2,
                            flexGrow: 1,
                            fontWeight: 500,
                            color: (theme) => darkSwitchGrey(theme),
                        }}
                    >
                        Filter Events by Type
                    </Typography>
                </Box>
                {eventComponentList}
            </Container>
            <Popover
                open={anchorEl !== null}
                anchorEl={anchorEl}
                onClose={closeFilters}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Box padding={3}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
                            Filter Events by Type
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={filters.event} onChange={handleChange} name="event" />}
                                label="Event"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.ga} onChange={handleChange} name="ga" />}
                                label="GA"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.meeting} onChange={handleChange} name="meeting" />}
                                label="Meeting"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filters.volunteering}
                                        onChange={handleChange}
                                        name="volunteering"
                                    />
                                }
                                label="Volunteering"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.other} onChange={handleChange} name="other" />}
                                label="Other"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
            </Popover>
        </HomeBase>
    );
};

export default Home;
