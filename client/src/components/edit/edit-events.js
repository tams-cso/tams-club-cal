import React from 'react';
import ActionButton from '../shared/action-button';

import { getEvent, postEvent } from '../../functions/api';
import { Event } from '../../functions/entries';
import {
    parseTimeZone,
    getTimezone,
    getParams,
    millisToDateAndTime,
    getDefaulEditDate,
    getDefaulEditTime,
} from '../../functions/util';
import './edit-events.scss';
import Loading from '../shared/loading';
import SubmitGroup from '../shared/submit-group';

class EditEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null,
            new: false,
            name: '',
            clubName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            description: '',
            type: 'event',
            invalid: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    changeType = (type) => this.setState({ type });

    // React controlled forms
    handleInputChange(event) {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleDateChange = (name, value) => {
        this.setState({ [name]: value });
    };

    // Submit the form and make a POST request
    submit = async () => {
        // Don't submit if missing required fields
        var invalid = this.testValid();
        if (invalid.length !== 0) {
            var invalidMessage = '';
            invalid.forEach((i) => (invalidMessage += `${i} cannot be empty!\n`));
            alert(invalidMessage);
            return;
        }

        // Calculate milliseconds from starting/ending datetimes
        var end = null;
        var start = parseTimeZone(`${this.state.startDate} ${this.state.startTime}`, getTimezone());
        if (this.state.type === 'event')
            end = parseTimeZone(`${this.state.endDate} ${this.state.endTime}`, getTimezone());
        else
            end = start;

        if (this.state.type === 'event' && end < start) {
            alert('Starting time cannot be after end time!');
            return;
        }

        // Create event object
        const fullEvent = new Event(
            this.state.type,
            this.state.name,
            this.state.clubName,
            start,
            end,
            this.state.description,
        );

        // POST event
        var res;
        if (this.state.new) res = await postEvent(fullEvent);
        else res = await postEvent(fullEvent, this.state.event.objId);

        // Get response and send to user
        if (res.status === 200) {
            alert(`Successfully ${this.state.new ? 'added' : 'edited'} event!`);
            window.location.href = `${window.location.origin}/events${window.location.search}`;
        } else alert(`${this.state.new ? 'Adding' : 'Editing'} event failed :(`);
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Name');
        if (this.state.clubName === '') invalid.push('Club Name');
        if (this.state.startDate === '') invalid.push('Start Date');
        if (this.state.startTime === '') invalid.push('Start Time');
        if (this.state.endDate === '' && this.state.type === 'event') invalid.push('End Date');
        if (this.state.endTime === '' && this.state.type === 'event') invalid.push('End Time');
        return invalid;
    };

    resetState = (event, isNew = false) => {
        if (isNew) {
            this.setState({
                event,
                new: isNew,
                clubName: event.club,
                description: event.description,
                type: event.type,
                startDate: getDefaulEditDate(),
                startTime: getDefaulEditTime(false),
                endDate: getDefaulEditDate(),
                endTime: getDefaulEditTime(true),
            });
        } else {
            // Convert to string times
            var startDatetime = millisToDateAndTime(event.start);
            var endDatetime = millisToDateAndTime(event.end);

            // Update form with saved fields
            this.setState({
                event,
                new: isNew,
                name: event.name,
                clubName: event.club,
                startDate: startDatetime.date,
                startTime: startDatetime.time,
                endDate: endDatetime.date,
                endTime: endDatetime.time,
                description: event.description,
                type: event.type,
            });
        }
    };

    async componentDidMount() {
        // Get id from url params
        const id = getParams('id');

        // Empty form if new
        if (id === null) {
            this.resetState(new Event(), true);
            return;
        }

        // Fill form with event
        const res = await getEvent(id);

        if (res.status === 200) this.resetState(res.data);
        else {
            alert(`Could not get event with the requested ID '${id}'. Redirecting to 'new event' page`);
            window.location.href = `${window.location.origin}/edit/events`;
        }
    }

    render() {
        // Return loading if event not got
        if (this.state.event === null && !this.state.new) return <Loading></Loading>;

        // If the type is 'event', add an ending date/time input
        var endObj;
        if (this.state.type == 'event') {
            endObj = (
                <div className="edit-events-end-date-obj">
                    <label htmlFor="endDate">End</label>
                    <input
                        name="endDate"
                        className="line-in edit-events-date-input"
                        type="date"
                        value={this.state.endDate}
                        onChange={this.handleInputChange}
                    ></input>
                    <input
                        name="endTime"
                        className="line-in edit-events-time-input"
                        type="time"
                        value={this.state.endTime}
                        onChange={this.handleInputChange}
                    ></input>
                    <br />
                </div>
            );
        }

        return (
            <div className="edit-events">
                <div className="edit-events-type-switcher">
                    <ActionButton
                        className={`edit-events-type-button edit-events-event-button edit-events-${this.state.type}-active`}
                        onClick={() => this.changeType('event')}
                    >
                        Event
                    </ActionButton>
                    <ActionButton
                        className={`edit-events-type-button edit-events-signup-button edit-events-${this.state.type}-active`}
                        onClick={() => this.changeType('signup')}
                    >
                        Signup/Deadline
                    </ActionButton>
                </div>
                <input
                    name="name"
                    className="line-in edit-events-name-input"
                    type="text"
                    placeholder="Event name..."
                    value={this.state.name}
                    onChange={this.handleInputChange}
                ></input>
                <label htmlFor="clubName">Club Name</label>
                <input
                    name="clubName"
                    className="line-in edit-events-club-name-input"
                    type="text"
                    placeholder="Enter the club hosting this event"
                    value={this.state.clubName}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                <label htmlFor="startDate">Start</label>
                <input
                    name="startDate"
                    className="line-in edit-events-date-input"
                    type="date"
                    value={this.state.startDate}
                    onChange={this.handleInputChange}
                ></input>
                <input
                    name="startTime"
                    className="line-in edit-events-time-input"
                    type="time"
                    value={this.state.startTime}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {endObj}
                {/* TODO Allow user to choose timezone */}
                <p className="edit-events-timezone-message">** Timezone is America/Chicago [CST/CDT] **</p>
                <label>Description</label>
                <br />
                <div className="center-div">
                    <textarea
                        name="description"
                        className="edit-events-description-input"
                        type="text"
                        placeholder="Enter a description for your event (use http/https to hyperlink urls automatically)"
                        value={this.state.description}
                        onChange={this.handleInputChange}
                    ></textarea>
                </div>
                <SubmitGroup submit={this.submit}></SubmitGroup>
            </div>
        );
    }
}

export default EditEvents;
