import React from 'react';
import { postEvent } from '../functions/api';
import { Event } from '../functions/entries';
import './Add.scss';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            clubName: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            links: [''],
            description: '',
            addedBy: '',
            type: 'event',
            invalid: [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        if (target.name.startsWith('links-')) this.linksInputChange(target);
        else this.setState({ [target.name]: target.value });
    }

    linksInputChange(target) {
        var linkNum = Number(target.name.substring(6));
        var oldLinkList = this.state.links;
        oldLinkList[linkNum] = target.value;

        // Add new link if text is typed into the last link box
        if (linkNum == this.state.links.length - 1 && target.value != '') oldLinkList.push('');

        this.setState({ links: oldLinkList });
    }

    add = () => {
        var invalid = this.testValid();
        if (invalid.length == 0) {
            // Filter out empty links
            var currLinks = this.state.links;
            var i = 0;
            while (i != currLinks.length) {
                if (currLinks[i] == '') currLinks.splice(i, 1);
                else i++;
            }

            // POST event
            console.log('submitted!');
            postEvent(
                new Event(
                    this.state.type,
                    this.state.name,
                    this.state.clubName,
                    this.state.startDate,
                    this.state.endDate,
                    this.state.startTime,
                    this.state.endTime,
                    currLinks,
                    this.state.description,
                    this.state.addedBy
                )
            ).then((status) => alert(status == 200 ? 'Successfully added!' : 'Adding event failed :(('));
        } else {
            this.setState({ invalid });
        }
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name == '') invalid.push('Name');
        if (this.state.clubName == '') invalid.push('Club Name');
        if (this.state.startDate == '') invalid.push('Start Date');
        if (this.state.startTime == '') invalid.push('Start Time');
        if (this.state.endDate == '') invalid.push('End Date');
        if (this.state.endTime == '') invalid.push('End Time');
        if (this.state.addedBy == '') invalid.push('Added By Name');
        return invalid;
    };

    changeType = (type) => this.setState({ type });

    render() {
        // If type is event, add an ending date/time
        var endObj;
        if (this.state.type == 'event') {
            endObj = (
                <div className="end-date-obj">
                    <label htmlFor="endDate">End</label>
                    <input
                        name="endDate"
                        className="line-in date-input"
                        type="date"
                        onChange={this.handleInputChange}
                    ></input>
                    <input
                        name="endTime"
                        className="line-in time-input"
                        type="time"
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
                    className="line-in links-input extra-link"
                    type="text"
                    placeholder="Add another link"
                    onChange={this.handleInputChange}
                ></input>
            );
        }
        if (extraLinks.length > 0) extraLinks.push(<br key="links-break" />);

        // Create "invalid element" messages
        var invalidMessage = [];
        this.state.invalid.forEach((i) => {
            invalidMessage.push(<p className="invalid-add" key={i}>{`${i} cannot be empty!`}</p>);
        });

        return (
            <div className="Add">
                <div className="type-switcher">
                    <button
                        className={`event-button type-button ${this.state.type}-active`}
                        onClick={() => this.changeType('event')}
                    >
                        Event
                    </button>
                    <button
                        className={`signup-button type-button ${this.state.type}-active`}
                        onClick={() => this.changeType('signup')}
                    >
                        Signup/Deadline
                    </button>
                </div>
                <input
                    name="name"
                    className="line-in name-input"
                    type="text"
                    placeholder="Event name..."
                    onChange={this.handleInputChange}
                ></input>
                <label htmlFor="clubName">Club Name</label>
                <input
                    name="clubName"
                    className="line-in club-name-input"
                    type="text"
                    placeholder="Enter the club hosting this event"
                    onChange={this.handleInputChange}
                ></input>
                <br />
                <label htmlFor="startDate">Start</label>
                <input
                    name="startDate"
                    className="line-in date-input"
                    type="date"
                    onChange={this.handleInputChange}
                ></input>
                <input
                    name="startTime"
                    className="line-in time-input"
                    type="time"
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {endObj}
                <label htmlFor="links-0">Links</label>
                <input
                    name="links-0"
                    className="line-in links-input"
                    type="text"
                    placeholder="Add a link"
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {extraLinks}
                <label>Description</label>
                <br />
                <textarea
                    name="description"
                    className="description-input"
                    type="text"
                    placeholder="Enter a description for your event"
                    onChange={this.handleInputChange}
                ></textarea>
                <label htmlFor="addedBy">YOUR Name</label>
                <input
                    name="addedBy"
                    className="line-in added-by-input"
                    type="text"
                    placeholder="The name of the person editing"
                    onChange={this.handleInputChange}
                ></input>
                <br />
                {invalidMessage}
                <div className="center-div">
                    <button className="submit-add" onClick={this.add}>
                        Add to Calendar
                    </button>
                </div>
            </div>
        );
    }
}

export default Add;
