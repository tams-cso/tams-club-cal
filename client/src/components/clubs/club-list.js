import React, { useEffect, useState } from 'react';
import { getClubList } from '../../functions/api';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ClubCard from './club-card';
import ClubTable from './club-table';
import Loading from '../shared/loading';
import AddButton from '../shared/add-button';
import ViewSwitcher from '../shared/view-switcher';
import SortSelect from '../shared/sort-select';

/**
 * The ClubList component displays a list of cards, each of which
 * contains a summary of each club and links to that specific club.
 */
const ClubList = () => {
    const [clubList, setClubList] = useState(null);
    const [clubCardList, setClubCardList] = useState(<Loading />);
    const [tableView, setTableView] = useState(false);
    const [sort, setSort] = useState('name');
    const [reverse, setReverse] = useState(false);

    // Fetch the club list on mount from database
    useEffect(async () => {
        // If the club list is already fetched, do nothing
        if (clubList !== null) return;

        // Fetch the club list from the database
        // and display the data/show an error depending on the result
        const clubs = await getClubList();
        if (clubs.status !== 200) {
            setClubCardList(
                <Loading error>
                    Could not get club data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
        } else setClubList(clubs.data);
    }, []);

    // Update the club list when the club list changes
    useEffect(() => {
        if (clubList === null) return;

        // Sort the list of clubs using a custom sorting method
        // We sort by advised first then sorting method (only name for now)
        const sortedList = clubList.sort((a, b) => {
            if (a.advised !== b.advised) return a.advised ? -1 : 1;
            return (reverse ? -1 : 1) * a[sort].localeCompare(b[sort]);
        });

        // Create a list of ClubCard components from the sorted list
        setClubCardList(
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                {sortedList.map((c) => (
                    <Grid item xs={12} sm={6} lg={4} key={c.name} sx={{ flexGrow: { lg: 1, xs: 0 } }}>
                        <ClubCard club={c} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [clubList, reverse]);

    return (
        <Container maxWidth="xl">
            <Box width="100%" marginBottom={2} display="flex" alignItems="center" height={48} justifyContent="flex-end">
                <SortSelect
                    value={sort}
                    setValue={setSort}
                    reverse={reverse}
                    setReverse={setReverse}
                    options={['name']}
                />
                <ViewSwitcher tableView={tableView} setTableView={setTableView} />
            </Box>
            <AddButton color="primary" label="Club" path="/edit/clubs" />
            {tableView ? <ClubTable clubs={clubList} /> : clubCardList}
        </Container>
    );
};

export default ClubList;
