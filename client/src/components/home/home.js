import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { getParams } from '../../functions/util';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import PageWrapper from '../shared/page-wrapper';
import HomeDrawerList from './home-drawer-list';
import EventList from './list/event-list';
import EventDisplay from './event-display';

const drawerWidth = 280;
const useStyles = makeStyles({
    drawer: {
        width: drawerWidth,
    },
    spacer: {
        width: drawerWidth,
        marginBottom: '0',
    },
});

const Home = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();
    const classes = useStyles();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Return the user to the home page if missing and ID
        if (id === null) setDisplay(<EventList />);
        else setDisplay(<EventDisplay id={id} />);
    }, [location]);

    return (
        <PageWrapper>
            <Hidden smDown>
                <Drawer variant="permanent" className={classes.drawer}>
                    <Toolbar className={classes.spacer} />
                    <HomeDrawerList />
                </Drawer>
            </Hidden>
            {display}
        </PageWrapper>
    );
};

export default Home;
