import React from 'react';
import { connect } from 'react-redux';
import { getPopupEdit, getPopupId, getPopupOpen, getPopupEvent } from '../redux/selectors';
import { setPopupOpen, setPopupId, setPopupEdit } from '../redux/actions';
import './EventPopup.scss';
import { addDayjsElement, getFormattedDate, getFormattedTime } from '../functions/util';
import { getEvent } from '../functions/api';

class EventPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { event: null };
    }
    
    getEventData = async () => {
        const event = await getEvent(this.props.event.objId);
        this.setState({ event });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.event !== this.props.event && this.props.popupOpen) {
            this.getEventData();
        }
        if (prevProps.popupOpen !== this.props.popupOpen && !this.props.popupOpen) {
            this.setState({ event: null });
        }
    }

    render() {
        // Return empty div if the current popup is not defined
        if (!this.props.popupOpen || this.state.event === null) return <div className="EventPopup"></div>;

        // Add a Dayjs attribute
        addDayjsElement(this.state.event);

        // Create link element list
        var linkData = [];
        this.state.event.links.forEach((link) =>
            linkData.push(
                <a className="event-link" key={link} href={link}>
                    {link}
                </a>
            )
        );

        return (
            <div className="EventPopup">
                <div className="event-left home-side">
                    {this.state.event.type === 'event' ? (
                        <p className="popup-event-type event">Event</p>
                    ) : (
                        <p className="popup-event-type signup">Signup</p>
                    )}
                    <p className="event-name">{this.state.event.name}</p>
                    <p className="event-club">{this.state.event.club}</p>
                    <p className="event-date">{getFormattedDate(this.state.event)}</p>
                    <p className="event-time">{getFormattedTime(this.state.event)}</p>
                    {linkData}
                    <p className="event-added-by">{'Added by: ' + this.state.event.addedBy}</p>
                </div>
                <div className="event-right home-side">
                    <p className="event-description">{this.state.event.description}</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
        event: getPopupEvent(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit };

export default connect(mapStateToProps, mapDispatchToProps)(EventPopup);
