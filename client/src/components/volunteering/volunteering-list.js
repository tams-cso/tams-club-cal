import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { getVolunteeringList } from '../../functions/api';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { setVolunteeringList } from '../../redux/actions';

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
import Loading from '../shared/loading';
import VolunteeringCard from './volunteering-card';
import AddButton from '../shared/add-button';
import ViewSwitcher from '../shared/view-switcher';
import VolunteeringTable from './volunteering-table';
import { darkSwitchGrey } from '../../functions/util';
import SortSelect from '../shared/sort-select';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        [theme.breakpoints.down('lg')]: {
            flexGrow: 1,
        },
    },
    filterLabel: {
        flexGrow: 1,
        marginLeft: 12,
        fontWeight: 500,
        color: darkSwitchGrey(theme),
    },
    viewSwitcher: {
        float: 'right',
    },
}));

const VolunteeringList = () => {
    const [volunteeringList, setVolunteeringList] = useState(null);
    const [filteredList, setFilteredList] = useState(null);
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
        if (volunteeringList !== null) return;

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
        setVolunteeringList(clubs.data);
    }, []);

    useEffect(() => {
        if (volunteeringList === null) return;

        setFilteredList(
            volunteeringList
                .filter((item) => {
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
            <AddButton color="primary" label="Volunteering" path="/edit/volunteering" />
            <Box width="100%" marginBottom={2} display="flex" alignItems="center">
                <Tooltip title="Filters">
                    <IconButton onClick={openFilters} size="large">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <Typography className={classes.filterLabel}>Filter</Typography>
                <SortSelect
                    value={sort}
                    setValue={setSort}
                    reverse={reverse}
                    setReverse={setReverse}
                    options={['name', 'club']}
                />
                <ViewSwitcher tableView={listView} setTableView={setListView} className={classes.viewSwitcher} />
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
