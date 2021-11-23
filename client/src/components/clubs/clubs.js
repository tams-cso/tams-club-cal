import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import ClubList from './club-list';
import ClubDisplay from './club-display';

/**
 * Clubs routing page which will display either a
 * list of clubs or info for a specific club, depending
 * on the ID in the querystring.
 */
const Clubs = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // If the ID exists, show that specific club
        // else, show the list of clubs
        if (id === null) setDisplay(<ClubList />);
        else setDisplay(<ClubDisplay id={id} />);
    }, [location]);

    return <PageWrapper title="Clubs">{display}</PageWrapper>;
};

export default Clubs;
