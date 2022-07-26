import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getVolunteeringList } from '../../src/api';
import { getAccessLevel } from '../../src/util/miscUtil';
import { darkSwitchGrey } from '../../src/util/cssUtil';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
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
import Typography from '@mui/material/Typography';
import Loading from '../../src/components/shared/loading';
import VolunteeringCard from '../../src/components/volunteering/volunteering-card';
import AddButton from '../../src/components/shared/add-button';
import ViewSwitcher from '../../src/components/shared/view-switcher';
import VolunteeringTable from '../../src/components/volunteering/volunteering-table';
import SortSelect from '../../src/components/shared/sort-select';
import PageWrapper from '../../src/components/shared/page-wrapper';
import TitleMeta from '../../src/components/meta/title-meta';
import { AccessLevelEnum } from '../../src/types/enums';

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const volRes = await getVolunteeringList();
    const level = await getAccessLevel(ctx);
    return {
        props: { volunteeringList: volRes.data, error: volRes.status !== 200, level },
    };
};

/**
 * The VolunteeringList component displays a list of cards, each of which
 * contains a summary of each volunteering opportunity and links to that specific volunteering opportunity.
 */
const Volunteering = ({ volunteeringList, error, level }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [filteredList, setFilteredList] = useState([]);
    const [volunteeringCardList, setVolunteeringCardList] = useState(<Loading />);
    const [anchorEl, setAnchorEl] = useState(null);
    const [listView, setListView] = useState(false);
    const [sort, setSort] = useState('name');
    const [reverse, setReverse] = useState(false);
    const [filters, setFilters] = useState({
        open: false,
        limited: false,
        semester: false,
        setTimes: false,
        weekly: false,
    });

    // Filter the volunteering list based on the filters and sort
    useEffect(() => {
        if (error) return;

        // We set the filtered list to the volunteering list
        // after filtering and sorting it.
        setFilteredList(
            volunteeringList
                .filter((item) => {
                    // If no filters selected, show all results
                    if (!(filters.open || filters.limited || filters.semester || filters.setTimes || filters.weekly))
                        return true;

                    // TODO: See if we can create a better/more intuitive filter system

                    // See if all true filters match and return false if not
                    // This will filter OUT any results that don't contain the required filters
                    if (filters.open && !item.filters.open) return false;
                    if (filters.limited && !item.filters.limited) return false;
                    if (filters.semester && !item.filters.semester) return false;
                    if (filters.setTimes && !item.filters.setTimes) return false;
                    if (filters.weekly && !item.filters.weekly) return false;
                    return true;
                })
                .sort((a, b) => {
                    const rev = reverse ? -1 : 1;
                    if (typeof a[sort] === 'string') {
                        return rev * a[sort].localeCompare(b[sort]);
                    } else {
                        return rev * (a[sort] - b[sort]);
                    }
                })
        );
    }, [volunteeringList, filters, sort, reverse]);

    // Create a list of ClubCard components from the filtered list
    useEffect(() => {
        // If the filtered list is not created, don't do anything
        if (filteredList === null || error) return;

        // Map the filtered list to a list of ClubCard components
        setVolunteeringCardList(
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                {filteredList.map((v) => (
                    <Grid item xs={12} sm={6} lg={4} key={v.name} sx={{ flexGrow: { lg: 0, xs: 1 } }}>
                        <VolunteeringCard volunteering={v} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [filteredList]);

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

    // Show error if errored
    if (error) {
        return (
            <PageWrapper>
                <Loading error>
                    Could not get volunteering list. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <TitleMeta title="Volunteering" path="/volunteering" />
            <Container maxWidth={false} sx={{ maxWidth: 1280 }}>
                <AddButton
                    color="primary"
                    label="Volunteering"
                    path="/edit/volunteering"
                    hidden={level < AccessLevelEnum.CLUBS}
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
                        Filter
                    </Typography>
                    <SortSelect
                        value={sort}
                        setValue={setSort}
                        reverse={reverse}
                        setReverse={setReverse}
                        options={['name', 'club']}
                    />
                    <ViewSwitcher tableView={listView} setTableView={setListView} sx={{ float: 'right' }} />
                </Box>
                {listView ? <VolunteeringTable volunteering={filteredList} /> : volunteeringCardList}
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
                                Filter Volunteering
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={filters.open} onChange={handleChange} name="open" />}
                                    label="Open"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filters.limited} onChange={handleChange} name="limited" />
                                    }
                                    label="Limited Spots"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filters.semester} onChange={handleChange} name="semester" />
                                    }
                                    label="Semester Long Committment"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filters.setTimes} onChange={handleChange} name="setTimes" />
                                    }
                                    label="Set Time Slots"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={filters.weekly} onChange={handleChange} name="weekly" />
                                    }
                                    label="Repeats Weekly"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Popover>
            </Container>
        </PageWrapper>
    );
};

export default Volunteering;
