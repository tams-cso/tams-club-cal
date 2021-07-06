import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HomeDrawer from './home-drawer';
import EventList from './event-list';

const createStyles = makeStyles({
    root: {
        display: 'flex',
        paddingTop: '1rem',
    },
});

const Home = () => {
    const [scheduleView, setScheduleView] = useState(true);
    const classes = createStyles();

    return (
        <div className={classes.root}>
            <HomeDrawer scheduleView={scheduleView} setScheduleView={setScheduleView}></HomeDrawer>
            <EventList />
        </div>
    );
};

export default Home;
