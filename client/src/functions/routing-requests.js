import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getEventList } from './api';
import { addDayjsElement, catchError } from './util';
import { getSavedEventList } from '../redux/selectors';
import { setEventList, setPopupOpen, setPopupId, resetPopupState } from '../redux/actions';

class RoutingRequests extends React.Component {
    fetchData = async () => {
        switch (this.props.location.pathname) {
            case '/':
            case '/events': {
                // If eventList hasn't been fetched, fetch with API
                if (this.props.eventList !== null) return;
                const res = await getEventList();

                // Catch errors
                if (catchError(res.status, 'Failed to get event list :(')) return;

                // Add dayJS objects to the event list and sort by the starting dates
                res.data.forEach((d) => addDayjsElement(d));
                res.data.sort((a, b) => a.start - b.start);

                // Save eventList to the store
                this.props.setEventList(res.data);

                break;
            }
            case '/resources': {
                break;
            }
            case '/clubs': {
                break;
            }
            default:
                break;
        }
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState) {
        // Close popup if going to page without popup (check for no search parameters in URL)
        // TODO: What if there are other search paramaters
        if (prevProps.location.search !== '' && this.props.location.search === '') {
            this.props.resetPopupState();
        }

        // Return if pathnames match (eg. opening popups)
        if (this.props.location.pathname === prevProps.location.pathname) return;

        // Because homepage has 2 redirects: / and /events
        if (
            (this.props.location.pathname === '/' || this.props.location.pathname === '/events') &&
            (prevProps.location.pathname === '/' || prevProps.location.pathname === '/events')
        )
            return;

        // Fetch data for the current page if not already gotten
        this.fetchData();
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state) => {
    return {
        eventList: getSavedEventList(state),
    };
};
const mapDispatchToProps = { setEventList, setPopupOpen, setPopupId, resetPopupState };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoutingRequests));
