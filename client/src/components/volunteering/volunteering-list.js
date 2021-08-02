import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { getVolunteeringList } from '../../functions/api';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { setVolunteeringList } from '../../redux/actions';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FilterListIcon from '@material-ui/icons/FilterList';
import Loading from '../shared/loading';
import VolunteeringCard from './volunteering-card';
import AddButton from '../shared/add-button';
import ViewSwitcher from '../shared/view-switcher';
import VolunteeringTable from './volunteering-table';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        [theme.breakpoints.down('md')]: {
            flexGrow: 1,
        },
    },
    viewSwitcher: {
        float: 'right',
    },
}));

const VolunteeringList = () => {
    const dispatch = useDispatch();
    const fullVolunteeringList = useSelector(getSavedVolunteeringList);
    const [filteredList, setFilteredList] = useState(null);
    const [volunteeringCardList, setVolunteeringCardList] = useState(<Loading />);
    const [anchorEl, setAnchorEl] = useState(null);
    const [listView, setListView] = useState(false);
    const [filters, setFilters] = useState({
        open: false,
        limited: false,
        semester: false,
        setTimes: false,
        weekly: false,
    });
    const classes = useStyles();

    const openFilters = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeFilters = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    };

    useEffect(async () => {
        if (fullVolunteeringList !== null) return;

        // Fetch the events list on mount from database
        const clubs = await getVolunteeringList();
        if (clubs.status !== 200) {
            setVolunteeringCardList(
                <Loading error>
                    Could not get volunteering data. Please reload the page or contact the site manager to fix this
                    issue.
                </Loading>
            );
            return;
        }
        dispatch(setVolunteeringList(clubs.data));
        setFilteredList(clubs.data);
    }, []);

    useEffect(() => {
        if (fullVolunteeringList === null) return;

        setFilteredList(
            fullVolunteeringList.filter((item) => {
                // If no filters selected, show all results
                if (!(filters.open || filters.limited || filters.semester || filters.setTimes || filters.weekly))
                    return true;

                // See if all true filters match and return false if not
                if (filters.open && !item.filters.open) return false;
                if (filters.limited && !item.filters.limited) return false;
                if (filters.semester && !item.filters.semester) return false;
                if (filters.setTimes && !item.filters.setTimes) return false;
                if (filters.weekly && !item.filters.weekly) return false;
                return true;
            })
        );
    }, [filters]);

    useEffect(() => {
        if (filteredList === null) return;

        setVolunteeringCardList(
            <Grid container spacing={4}>
                {filteredList.map((v) => (
                    <Grid item xs={12} sm={6} lg={4} className={classes.gridItem} key={v.name}>
                        <VolunteeringCard volunteering={v} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [filteredList]);

    return (
        <Container>
            <AddButton color="primary" path="/edit/volunteering" />
            <Box width="100%" marginBottom={2}>
                <Tooltip title="Filters">
                    <IconButton onClick={openFilters}>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <ViewSwitcher listView={listView} setListView={setListView} className={classes.viewSwitcher} />
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
                        <FormLabel component="legend">Filter Volunteering</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={filters.open} onChange={handleChange} name="open" />}
                                label="Open"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.limited} onChange={handleChange} name="limited" />}
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
                                control={<Checkbox checked={filters.weekly} onChange={handleChange} name="weekly" />}
                                label="Repeats Weekly"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
            </Popover>
        </Container>
    );
};

export default VolunteeringList;
