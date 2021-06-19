import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HomeDrawer from './home-drawer';

const createStyles = makeStyles({
    root: {
        display: 'flex',
    },
});

const Home = () => {
    const [scheduleView, setScheduleView] = useState(true);
    const classes = createStyles();

    return (
        <div className={classes.root}>
            <HomeDrawer scheduleView={scheduleView} setScheduleView={setScheduleView}></HomeDrawer>
            <Container></Container>
        </div>
    );
};

export default Home;
