import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';

import { getEvent, postEvent } from '../../functions/api';
import { Event, EventInfo } from '../../functions/entries';
import { getPopupId, getPopupOpen, getSavedEventList } from '../../redux/selectors';
import { setPopupOpen, setPopupId, resetPopupState } from '../../redux/actions';
import {
    addDayjsElement,
    getFormattedDate,
    getFormattedTime,
    parseTimeZone,
    getTimezone,
    parseLinks,
} from '../../functions/util';

import './event-popup.scss';
import Loading from '../shared/loading';

class EventPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null,
            name: '',
            clubName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            links: [''],
            description: '',
            editedBy: '',
            type: 'event',
            showEditedBy: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
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

    closeEdit = () => {
        this.props.setPopupEdit(false);
        this.resetState();
    };

    toggleEditedBy = () => {
        this.setState({ showEditedBy: !this.state.showEditedBy });
    };

    handleInputChange = (event) => {
        const target = event.target;
        if (target.name.startsWith('links-')) this.linksInputChange(target);
        else this.setState({ [target.name]: target.value });
    };

    linksInputChange = (target) => {
        var linkNum = Number(target.name.substring(6));
        var oldLinkList = this.state.links;
        oldLinkList[linkNum] = target.value;

        // Add new link if text is typed into the last link box
        if (linkNum === this.state.links.length - 1 && target.value != '') oldLinkList.push('');

        this.setState({ links: oldLinkList });
    };

    changeType = (type) => this.setState({ type });

    submit = async () => {
        // Don't submit if missing required fields
        var invalid = this.testValid();
        if (invalid.length !== 0) {
            var invalidMessage = '';
            invalid.forEach((i) => (invalidMessage += `${i} cannot be empty!\n`));
            alert(invalidMessage);
            return;
        }

        // Filter out empty links
        var currLinks = this.state.links;
        var i = 0;
        while (i != currLinks.length) {
            if (currLinks[i] === '') currLinks.splice(i, 1);
            else i++;
        }

        // Calculate milliseconds from starting/ending datetimes
        var end = null;
        var start = parseTimeZone(`${this.state.startDate} ${this.state.startTime}`, getTimezone());
        if (this.state.type === 'event')
            var end = parseTimeZone(`${this.state.endDate} ${this.state.endTime}`, getTimezone());

        var editedBy = [...this.state.event.editedBy];
        editedBy.push(this.state.editedBy);

        var fullEvent = new Event(
            this.state.type,
            this.state.name,
            this.state.clubName,
            start,
            end,
            currLinks,
            this.state.description,
            editedBy
        );

        // POST event
        const res = await postEvent(fullEvent, this.state.event.objId);
        if (res.status === 200) {
            var eventObj = new EventInfo(
                this.state.event.objId,
                this.state.type,
                this.state.name,
                this.state.clubName,
                start,
                end
            );

            addDayjsElement(eventObj);
            this.props.updateEvent(this.state.event.objId, eventObj);
            this.props.setPopupEdit(false);

            this.setState({ event: fullEvent });
            alert('Successfully edited!');
        } else alert('Editing event failed :(');
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Name');
        if (this.state.clubName === '') invalid.push('Club Name');
        if (this.state.startDate === '') invalid.push('Start Date');
        if (this.state.startTime === '') invalid.push('Start Time');
        if (this.state.endDate === '' && this.state.type === 'event') invalid.push('End Date');
        if (this.state.endTime === '' && this.state.type === 'event') invalid.push('End Time');
        if (this.state.editedBy === '') invalid.push('Edited By Name');
        return invalid;
    };

    componentDidMount() {
        if (this.props.id !== null && this.props.id !== '') this.getEventData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.popupOpen === this.props.popupOpen) return;
        if (this.props.popupOpen && this.props.id !== null) {
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

        // Create edited by display (if set to true or else just display added by)
        var editedByDisplay = `Added by: ${this.state.event.editedBy[0]}`;
        if (this.state.showEditedBy) {
            for (var i = 1; i < this.state.event.editedBy.length; i++) {
                editedByDisplay += `<br />Edited by: ${this.state.event.editedBy[i]}`;
            }
        }

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
                        <p
                            className="event-popup-edited-by"
                            onClick={this.toggleEditedBy}
                            dangerouslySetInnerHTML={{ __html: editedByDisplay }}
                        ></p>
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
        event: getSavedEventList(state),
        resetPopup: resetPopupState(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(EventPopup);
