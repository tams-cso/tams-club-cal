import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getParams } from '../../functions/util';

import PageWrapper from '../shared/page-wrapper';
import VolunteeringList from './volunteering-list';
import VolunteeringDisplay from './volunteering-display';

/**
 * Volunteering routing page which will display either a
 * list of volunteering opportunities or info for a specific
 * volunteering opportunity, depending on the ID in the querystring.
 */
const Volunteering = () => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // If the ID exists, show that specific volunteering opportunity
        // else, show the list of volunteering opportunities
        if (id === null) setDisplay(<VolunteeringList />);
        else setDisplay(<VolunteeringDisplay id={id} />);
    }, [location]);

    return <PageWrapper title="Volunteering">{display}</PageWrapper>;
};

export default Volunteering;
