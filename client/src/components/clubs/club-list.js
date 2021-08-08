import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { getClubList } from '../../functions/api';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ClubCard from './club-card';
import Loading from '../shared/loading';
import AddButton from '../shared/add-button';
import ViewSwitcher from '../shared/view-switcher';
import ClubTable from './club-table';
import SortSelect from '../shared/sort-select';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        [theme.breakpoints.down('md')]: {
            flexGrow: 1,
        },
    },
}));

const ClubList = () => {
    const [clubList, setClubList] = useState(null);
    const [clubCardList, setClubCardList] = useState(<Loading />);
    const [listView, setListView] = useState(false);
    const [sort, setSort] = useState('name');
    const [reverse, setReverse] = useState(false);
    const classes = useStyles();

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (clubList !== null) return;
        const clubs = await getClubList();
        if (clubs.status !== 200) {
            setClubCardList(
                <Loading error>
                    Could not get club data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }
        setClubList(clubs.data);
    }, []);

    useEffect(() => {
        if (clubList === null) return;

        const sortedList = clubList.sort((a, b) => {
            if (a.advised !== b.advised) return a.advised ? -1 : 1;
            const rev = reverse ? -1 : 1;
            if (typeof a[sort] === 'string') {
                return rev * a[sort].localeCompare(b[sort]);
            } else {
                return rev * (a[sort] - b[sort]);
            }
        });

        setClubCardList(
            <Grid container spacing={4}>
                {sortedList.map((c) => (
                    <Grid item xs={12} sm={6} lg={4} className={classes.gridItem} key={c.name}>
                        <ClubCard club={c} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [clubList, sort, reverse]);

    return (
        <Container>
            <Box width="100%" marginBottom={2} display="flex" alignItems="center" height={48} justifyContent="flex-end">
                <SortSelect
                    value={sort}
                    setValue={setSort}
                    reverse={reverse}
                    setReverse={setReverse}
                    options={['name']}
                />
                <ViewSwitcher listView={listView} setListView={setListView} className={classes.viewSwitcher} />
            </Box>
            <AddButton color="primary" label="Club" path="/edit/clubs" />
            {listView ? <ClubTable clubs={clubList} /> : clubCardList}
        </Container>
    );
};

export default ClubList;
