import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getParams } from '../../functions/util';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Hidden from '@mui/material/Hidden';
import PageWrapper from '../shared/page-wrapper';
import HomeDrawerList from './home-drawer-list';
import EventList from './list/event-list';
import EventDisplay from './event-display';
import Calendar from './calendar/calendar';
import Reservations from './reservation/reservations';
import ActionBar from './action-bar';

// The width of the permanent drawer with external links
const drawerWidth = 280;

/**
 * The main home page that displays events, reservations, and a calendar.
 * This page also contains a drawer that has external links.
 * This component itself functions as a switch between the different views.
 * Both '/' and '/events' will route to this component.
 */
const Home = () => {
    const [display, setDisplay] = useState(null);
    const [view, setView] = useState('schedule');
    const [id, setId] = useState(null);
    const location = useLocation();

    // Sets the view of the page based on the url
    // This will not run if the ID exists as that points to a page
    useEffect(() => {
        // If the ID exists, don't show a specific view
        if (id) return;

        // Set the view based on the 'view' state variable
        if (view === 'calendar') setDisplay(<Calendar />);
        else if (view === 'reservation') setDisplay(<Reservations />);
        else setDisplay(<EventList />);
    }, [view, id]);

    // If the ID exists, show a single event page
    useEffect(() => {
        // Extract ID from url search params
        const newId = getParams('id');
        setId(newId);

        // If user has ID, send them to the display page
        if (newId) setDisplay(<EventDisplay id={newId} />);
    }, [location]);

    return (
        <PageWrapper noBottom>
            <Hidden mdDown>
                {view === 'reservation' ? null : (
                    <Drawer variant="permanent" sx={{ width: drawerWidth }}>
                        <Toolbar sx={{ width: drawerWidth, marginBottom: 0 }} />
                        <HomeDrawerList />
                    </Drawer>
                )}
            </Hidden>
            <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                width={0}
                sx={{ height: view === 'calendar' ? 'unset' : 'max-content' }}
            >
                {id ? null : <ActionBar view={view} setView={setView} />}
                {display}
            </Box>
        </PageWrapper>
    );
};

export default Home;
