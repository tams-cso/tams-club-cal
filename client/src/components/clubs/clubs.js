import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { getClubList } from '../../functions/api';
import { getSavedClubList } from '../../redux/selectors';
import { setClubList } from '../../redux/actions';

import ClubCard from './club-card';
import Loading from '../shared/loading';
import PageWrapper from '../shared/page-wrapper';

const Clubs = () => {
    const dispatch = useDispatch();
    const clubList = useSelector(getSavedClubList);
    const [clubCardList, setClubCardList] = useState(<Loading />);

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (clubList !== null) return;
        const clubs = await getClubList();
        console.log(clubs)
        if (clubs.status !== 200) {
            setClubCardList(
                <Loading error="true">
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
            <Grid>
                {clubList.map((c) => (
                    <ClubCard club={c} key={c.name} />
                ))}
            </Grid>
        );
    }, [clubList]);

    return <PageWrapper>{clubCardList}</PageWrapper>;
};

export default Clubs;
