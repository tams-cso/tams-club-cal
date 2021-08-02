import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { getClubList } from '../../functions/api';
import { getSavedClubList } from '../../redux/selectors';
import { setClubList } from '../../redux/actions';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ClubCard from './club-card';
import Loading from '../shared/loading';
import AddButton from '../shared/add-button';
import ViewSwitcher from '../shared/view-switcher';
import ClubTable from './club-table';

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

const ClubList = () => {
    const dispatch = useDispatch();
    const clubList = useSelector(getSavedClubList);
    const [clubCardList, setClubCardList] = useState(<Loading />);
    const [listView, setListView] = useState(false);
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
        dispatch(setClubList(clubs.data));
    }, []);

    useEffect(() => {
        if (clubList === null) return;
        setClubCardList(
            <Grid container spacing={4}>
                {clubList.map((c) => (
                    <Grid item xs={12} sm={6} lg={4} className={classes.gridItem} key={c.name}>
                        <ClubCard club={c} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [clubList]);

    return (
        <Container>
            <Box width="100%" marginBottom={2} height={48}>
                <ViewSwitcher listView={listView} setListView={setListView} className={classes.viewSwitcher} />
            </Box>
            <AddButton color="primary" path="/edit/clubs" />
            {listView ? <ClubTable clubs={clubList} /> : clubCardList}
        </Container>
    );
};

export default ClubList;
