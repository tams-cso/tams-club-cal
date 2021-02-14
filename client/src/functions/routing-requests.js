import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getClubList, getEventList, getVolunteering } from './api';
import { addDayjsElement, catchError, getParams } from './util';
import { getMobileDropdown, getSavedClubList, getSavedEventList, getSavedVolunteeringList } from '../redux/selectors';
import {
    setEventList,
    setPopupOpen,
    setPopupId,
    resetPopupState,
    setClubList,
    setVolunteeringList,
    setMobileDropdown,
} from '../redux/actions';

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
                // If volunteering list hasn't been fetched, fetch with API
                if (this.props.volunteeringList !== null) return;
                const res = await getVolunteering();

                // Catch errors and save to store
                if (catchError(res.status, 'Failed to get volunteering list :(')) return;
                this.props.setVolunteeringList(res.data);

                break;
            }
            case '/clubs': {
                // If club list hasn't been fetched, fetch with API
                if (this.props.clubList !== null) return;
                const res = await getClubList();

                // Catch errors and save to store
                if (catchError(res.status, 'Failed to get club list :(')) return;
                this.props.setClubList(res.data);

                break;
            }
            default:
                break;
        }
    };

    activatePopup = (id) => {
        // Detect if new and set relevant flags
        if (id === 'new') {
            this.props.setPopupNew(true);
            this.props.setPopupEdit(true);
        }

        // Set the ID and open the popup
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
        console.log(id);
    };

    componentDidMount() {
        // Activate popup
        const id = getParams('id');
        if (id !== undefined && id !== null) this.activatePopup(id);

        // Fetch data
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        // Only run functions for location changes
        if (prevProps.location === this.props.location) return;

        // Close popup if going to page without popup (check for no search parameters in URL)
        // TODO: What if there are other search paramaters
        if (prevProps.location.search !== '' && this.props.location.search === '') {
            this.props.resetPopupState();
        }

        // Clear up any new popup inconsistencies
        if (this.props.new && getParams('id') !== 'new') {
            this.props.setPopupNew(false);
        }

        // Return if pathnames match (eg. opening popups)
        if (this.props.location.pathname === prevProps.location.pathname) return;

        // Close mobile menu on any route change
        if (this.props.mobileDropdown) this.props.setMobileDropdown(false);

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
        clubList: getSavedClubList(state),
        volunteeringList: getSavedVolunteeringList(state),
        mobileDropdown: getMobileDropdown(state),
    };
};
const mapDispatchToProps = {
    setPopupOpen,
    setPopupId,
    resetPopupState,
    setEventList,
    setVolunteeringList,
    setClubList,
    setMobileDropdown,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoutingRequests));
