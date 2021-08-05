import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import ClubList from './club-list';
import ClubDisplay from './club-display';

const Clubs = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Return the user to the home page if missing and ID
        if (id === null) setDisplay(<ClubList />);
        else setDisplay(<ClubDisplay id={id} />);
    }, [location]);

    return (
        <PageWrapper>
            <Helmet>
                <title>Clubs - TAMS Club Calendar</title>
            </Helmet>
            {display}
        </PageWrapper>
    );
};

export default Clubs;
