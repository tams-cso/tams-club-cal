import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';

import { getEvent } from '../../functions/api';
import { getPopupId, getPopupOpen, getPopupType } from '../../redux/selectors';
import { resetPopupState } from '../../redux/actions';
import {
    addDayjsElement,
    getFormattedDate,
    getFormattedTime,
    parseLinks,
} from '../../functions/util';

import './event-popup.scss';
import Loading from '../shared/loading';

class EventPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { event: null };
    }

    getEventData = async () => {
        const res = await getEvent(this.props.id);
        if (res.status !== 200) {
            this.props.resetPopup();
            alert(`ERROR ${res.status}: Cannot get event :(`);
            return;
        }
        this.setState({ event: res.data });
    };

    openEdit = () => {
        window.location.href = `${window.location.origin}/edit/events?id=${this.state.event.objId}`;
    };

    componentDidMount() {
        if (this.props.id !== null && this.props.id !== '' && this.props.type === 'events') this.getEventData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.popupOpen === this.props.popupOpen) return;
        if (this.props.popupOpen && this.props.id !== null && this.props.type === 'events') {
            this.getEventData();
        } else {
            this.setState({ event: null });
        }
    }

    render() {
        // Return empty div if the current popup is not defined
        if (!this.props.popupOpen || this.state.event === null) return <Loading className="event-popup"></Loading>;

        // Add a Dayjs attribute
        addDayjsElement(this.state.event);

        // Create link element list
        var linkData = [];
        var i = 0;
        this.state.event.links.forEach((link) =>
            linkData.push(
                <a className="event-popup-link" key={`link-${i++}`} href={link}>
                    {link}
                </a>
            )
        );

        const description = parseLinks('event-popup-description', this.state.event.description);

        return (
            <div className="event-popup">
                <div className="event-popup-display">
                    <div className="event-popup-left event-popup-home-side">
                        {this.state.event.type === 'event' ? (
                            <p className="event-popup-type event">Event</p>
                        ) : (
                            <p className="event-popup-type signup">Signup</p>
                        )}
                        <p className="event-popup-name">{this.state.event.name}</p>
                        <p className="event-popup-club">{this.state.event.club}</p>
                        <p className="event-popup-date">{getFormattedDate(this.state.event)}</p>
                        <p className="event-popup-time">{getFormattedTime(this.state.event)}</p>
                        {linkData}
                        <ActionButton className="event-popup-open-edit" onClick={this.openEdit}>
                            Edit
                        </ActionButton>
                    </div>
                    <div className="event-popup-right event-popup-home-side">{description}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        type: getPopupType(state),
    };
};
const mapDispatchToProps = { resetPopupState };

export default connect(mapStateToProps, mapDispatchToProps)(EventPopup);
