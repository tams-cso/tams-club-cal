import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Helmet } from 'react-helmet';

import HistoryList from './history/history-list';
import HistoryDisplay from './history/history-display';
import PageWrapper from '../shared/page-wrapper';

const EditHistory = (props) => {
    const [display, setDisplay] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Extract ID from url search params
        const resource = props.match.params.resource;

        // Return the user to the home page if missing and ID
        if (resource === null) setDisplay(<HistoryList />);
        else setDisplay(<HistoryDisplay resource={resource} />);
    }, [location]);

    return (
        <PageWrapper>
            <Helmet>
                <title>Edit History - TAMS Club Calendar</title>
            </Helmet>
            {display}
        </PageWrapper>
    );
};

export default EditHistory;
