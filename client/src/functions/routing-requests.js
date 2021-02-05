import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getSavedEventList } from '../redux/selectors';
import { setEventList, setPopupOpen, setPopupId } from '../redux/actions';

class RoutingRequests extends React.Component {
    componentDidMount() {
        
    }

    componentDidUpdate() {

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
const mapDispatchToProps = { setEventList, setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoutingRequests));
