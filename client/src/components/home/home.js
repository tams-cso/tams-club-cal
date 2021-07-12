import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import HomeDrawer from './home-drawer';
import EventList from './event-list';
import EventDisplay from './event-display';

const Home = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Return the user to the home page if missing and ID
        if (id === null) setDisplay(<EventList />);
        else setDisplay(<EventDisplay id={id} />);
    }, [location]);

    return (
        <PageWrapper>
            <HomeDrawer />
            {display}
        </PageWrapper>
    );
};

export default Home;
