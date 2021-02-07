import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';

import { getEvent, postEvent } from '../../functions/api';
import { Event, EventInfo } from '../../functions/entries';
import { getPopupEdit, getPopupId, getPopupOpen, getSavedEventList } from '../../redux/selectors';
import { setPopupOpen, setPopupId, setPopupEdit, updateEvent, resetPopupState } from '../../redux/actions';
import {
    addDayjsElement,
    getFormattedDate,
    getFormattedTime,
    millisToDateAndTime,
    parseTimeZone,
    getTimezone,
    isPopupInvalid,
    parseLinks,
} from '../../functions/util';

import './event-popup.scss';

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
        this.setState({ event: res.data }, () => {
            this.resetState();
        });
    };

    openEdit = () => {
        this.props.setPopupEdit(true);
    };

    closeEdit = () => {
        this.props.setPopupEdit(false);
        this.resetState();
    };

    toggleEditedBy = () => {
        this.setState({ showEditedBy: !this.state.showEditedBy });
    };

    // TODO: Pass in event object to reset state
    resetState = () => {
        var startDatetime = millisToDateAndTime(this.state.event.start);
        var endDatetime = millisToDateAndTime(this.state.event.end);
        var linkList = this.state.event.links;
        linkList.push('');
        this.setState({
            name: this.state.event.name,
            clubName: this.state.event.club,
            startDate: startDatetime.date,
            startTime: startDatetime.time,
            endDate: endDatetime.date,
            endTime: endDatetime.time,
            links: linkList,
            description: this.state.event.description,
            editedBy: '',
            type: this.state.event.type,
        });
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
        if (this.props.id !== null && this.props.id !== '' && !isPopupInvalid()) this.getEventData();
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
        if (!this.props.popupOpen || this.state.event === null || isPopupInvalid())
            return <div className="EventPopup"></div>;

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

        // If type is event, add an ending date/time
        var endObj;
        if (this.state.type === 'event') {
            endObj = (
                <div className="end-date-obj">
                    <label htmlFor="endDate">End</label>
                    <input
                        name="endDate"
                        className="line-in add-date-input"
                        type="date"
                        value={this.state.endDate}
                        onChange={this.handleInputChange}
                    ></input>
                    <input
                        name="endTime"
                        className="line-in add-time-input"
                        type="time"
                        value={this.state.endTime}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                </div>
            );
        }

        // Create lines for adding more links if needed
        var extraLinks = [];
        for (var i = 1; i < this.state.links.length; i++) {
            extraLinks.push(
                <input
                    name={'links-' + i}
                    key={'links-' + i}
                    className="line-in links-input add-extra-link event-popup-extra-link"
                    type="text"
                    placeholder="Add another link"
                    value={this.state.links[i]}
                    onChange={this.handleInputChange}
                ></input>
            );
        }
        if (extraLinks.length > 0) extraLinks.push(<br key="links-break" />);

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
                <div className={'event-popup-display' + (!this.props.edit ? ' active' : ' inactive')}>
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
                <div className={'event-popup-edit' + (this.props.edit ? ' active' : ' inactive')}>
                    {/* TODO: Convert a lot of these to 'add' className to share css from add page */}
                    <div className="add-type-switcher">
                        <ActionButton
                            className={`add-type-button add-event-button add-${this.state.type}-active`}
                            onClick={() => this.changeType('event')}
                        >
                            Event
                        </ActionButton>
                        <ActionButton
                            className={`add-type-button add-signup-button add-${this.state.type}-active`}
                            onClick={() => this.changeType('signup')}
                        >
                            Signup/Deadline
                        </ActionButton>
                    </div>
                    <input
                        name="name"
                        className="line-in event-popup-name-input"
                        type="text"
                        placeholder="Event name..."
                        value={this.state.name}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <label htmlFor="clubName">Club Name</label>
                    <input
                        name="clubName"
                        className="line-in event-popup-club-name-input"
                        type="text"
                        placeholder="Enter the club hosting this event"
                        value={this.state.clubName}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <label htmlFor="startDate">Start</label>
                    <input
                        name="startDate"
                        className="line-in add-date-input"
                        type="date"
                        value={this.state.startDate}
                        onChange={this.handleInputChange}
                    ></input>
                    <input
                        name="startTime"
                        className="line-in add-time-input"
                        type="time"
                        value={this.state.startTime}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    {endObj}
                    {/* TODO timezone edit */}
                    <p className="add-timezone-message">** Timezone is America/Chicago [CST/CDT] **</p>
                    <label htmlFor="links-0">Links</label>
                    <input
                        name="links-0"
                        className="line-in event-popup-links-input"
                        type="text"
                        placeholder="Add a link"
                        value={this.state.links[0]}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    {extraLinks}
                    <label>Description</label>
                    <br />
                    <textarea
                        name="description"
                        className="event-popup-description-input"
                        type="text"
                        placeholder="Enter a description for your event"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                    ></textarea>
                    <label htmlFor="editedBy">YOUR Name</label>
                    <input
                        name="editedBy"
                        className="line-in event-popup-edited-by-input"
                        type="text"
                        placeholder="The name of the person editing"
                        value={this.state.editedBy}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <div className="event-popup-action-button-box">
                        <ActionButton className="cancel" onClick={this.closeEdit}>
                            Cancel
                        </ActionButton>
                        <ActionButton className="submit" onClick={this.submit}>
                            Submit
                        </ActionButton>
                    </div>
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
        event: getSavedEventList(state),
        resetPopup: resetPopupState(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit, updateEvent };

export default connect(mapStateToProps, mapDispatchToProps)(EventPopup);
