import React from 'react';
import ActionButton from '../shared/action-button';

import { getEvent, postEvent } from '../../functions/api';
import { Event } from '../../functions/entries';
import { parseTimeZone, getTimezone, getParams, millisToDateAndTime } from '../../functions/util';
import './edit-events.scss';
import Loading from '../shared/loading';
import { withRouter } from 'react-router';

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
            links: [''],
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
        if (target.name.startsWith('links-')) this.linksInputChange(target);
        else this.setState({ [target.name]: target.value });
    }

    // Handle changing of links
    linksInputChange(target) {
        var linkNum = Number(target.name.substring(6));
        var oldLinkList = this.state.links;
        oldLinkList[linkNum] = target.value;

        // Add new link if text is typed into the last link box
        if (linkNum == this.state.links.length - 1 && target.value != '') oldLinkList.push('');

        // TODO: Remove unused links
        this.setState({ links: oldLinkList });
    }

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
            end = parseTimeZone(`${this.state.endDate} ${this.state.endTime}`, getTimezone());

        // Create event object
        const fullEvent = new Event(
            this.state.type,
            this.state.name,
            this.state.clubName,
            start,
            end,
            currLinks,
            this.state.description,
            ['']
        );

        // POST event
        var res;
        if (this.state.new) res = await postEvent(fullEvent);
        else res = await postEvent(fullEvent, this.state.event.objId);

        // Get response and send to user
        if (res.status === 200) {
            alert(`Successfully ${this.state.new ? 'added' : 'edited'} event!`);
            this.props.parentHistory.push('/');
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

    resetState = (event) => {
        // Convert to string times
        var startDatetime = millisToDateAndTime(event.start);
        var endDatetime = millisToDateAndTime(event.end);

        // Create list of links
        var linkList = event.links;
        linkList.push('');

        // Update form with saved fields
        this.setState({
            event,
            name: event.name,
            clubName: event.club,
            startDate: startDatetime.date,
            startTime: startDatetime.time,
            endDate: endDatetime.date,
            endTime: endDatetime.time,
            links: linkList,
            description: event.description,
            editedBy: '',
            type: event.type,
        });
    };

    async componentDidMount() {
        // Get id from url params
        const id = getParams('id');

        // Empty form if new
        if (id === null) {
            this.setState({ new: true });
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

        // Create lines for adding more links if needed
        var extraLinks = [];
        for (var i = 1; i < this.state.links.length; i++) {
            extraLinks.push(
                <input
                    name={'links-' + i}
                    key={'links-' + i}
                    className="line-in edit-events-links-input edit-events-extra-link"
                    type="text"
                    placeholder="Add another link"
                    value={this.state.links[i]}
                    onChange={this.handleInputChange}
                ></input>
            );
        }
        if (extraLinks.length > 0) extraLinks.push(<br key="links-break" />);

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
                <label htmlFor="links-0">Links</label>
                <input
                    name="links-0"
                    className="line-in edit-events-links-input"
                    type="text"
                    placeholder="Add a link"
                    value={this.state.links[0]}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {extraLinks}
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
                <div className="center-button">
                    <ActionButton className="edit-events-submit" onClick={this.submit}>
                        Add to Calendar
                    </ActionButton>
                </div>
            </div>
        );
    }
}

export default withRouter(EditEvents);
