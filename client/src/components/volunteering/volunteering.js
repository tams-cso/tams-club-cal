import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import VolunteeringList from './volunteering-list';
import VolunteeringDisplay from './volunteering-display';

const Volunteering = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Return the user to the home page if missing and ID
        if (id === null) setDisplay(<VolunteeringList />);
        else setDisplay(<VolunteeringDisplay id={id} />);
    }, [location]);

    return (
        <PageWrapper>
            <Helmet>
                <title>Volunteering - TAMS Club Calendar</title>
            </Helmet>
            {display}
        </PageWrapper>
    );
};

export default Volunteering;
