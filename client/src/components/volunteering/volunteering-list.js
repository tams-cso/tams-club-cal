import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { getVolunteeringList } from '../../functions/api';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { setVolunteeringList } from '../../redux/actions';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Loading from '../shared/loading';
import VolunteeringCard from './volunteering-card';

const useStyles = makeStyles((theme) => ({
    gridItem: {
        [theme.breakpoints.down('md')]: {
            flexGrow: 1,
        },
    },
}));

const ClubList = () => {
    const dispatch = useDispatch();
    const volunteeringList = useSelector(getSavedVolunteeringList);
    const [volunteeringCardList, setVolunteeringCardList] = useState(<Loading />);
    const classes = useStyles();

    useEffect(async () => {
        // Fetch the events list on mount from database
        if (volunteeringList !== null) return;
        const clubs = await getVolunteeringList();
        if (clubs.status !== 200) {
            setVolunteeringCardList(
                <Loading error>
                    Could not get volunteering data. Please reload the page or contact the site manager to fix this issue.
                </Loading>
            );
            return;
        }
        dispatch(setVolunteeringList(clubs.data));
    }, []);

    useEffect(() => {
        if (volunteeringList === null) return;
        setVolunteeringCardList(
            <Grid container spacing={4}>
                {volunteeringList.map((v) => (
                    <Grid item xs={12} sm={6} lg={4} className={classes.gridItem} key={v.name}>
                        <VolunteeringCard volunteering={v} />
                    </Grid>
                ))}
            </Grid>
        );
    }, [volunteeringList]);

    return <Container>{volunteeringCardList}</Container>;
};

export default ClubList;
