import React from 'react';
import HomeDrawer from './home-drawer';
import EventList from './event-list';
import PageWrapper from '../shared/page-wrapper';

const Home = () => {
    return (
        <PageWrapper>
            <HomeDrawer />
            <EventList />
        </PageWrapper>
    );
};

export default Home;
