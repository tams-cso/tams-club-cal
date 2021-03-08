import React from 'react';
import { getVolunteering, postVolunteering } from '../../functions/api';
import { Volunteering } from '../../functions/entries';
import { getParams, returnToLastLocation } from '../../functions/util';
import ActionButton from '../shared/action-button';
import Loading from '../shared/loading';
import SubmitGroup from '../shared/submit-group';
import './edit-volunteering.scss';

class EditVolunteering extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volunteering: null,
            new: false,
            open: true,
            name: '',
            club: '',
            description: '',
            filters: {},
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    changeFilter = (filter) => {
        var filterList = this.state.filters;
        filterList[filter] = !filterList[filter];
        this.setState({ filters: filterList });
    };

    changeOpen = () => {
        this.setState({ open: !this.state.open });
    };

    submit = async () => {
        var invalid = this.testValid();
        if (invalid.length !== 0) {
            var message = '';
            invalid.forEach((i) => (message += `${i} cannot be empty!\n`));
            alert(message);
            return;
        }

        // Updated 'open' filter
        var filters = this.state.filters;
        filters['open'] = this.state.open;

        // Create volunteering object
        var volunteeringObj = new Volunteering(
            this.state.name,
            this.state.club,
            this.state.description,
            filters,
            this.state.signupTime || null,
        );

        // POST volunteering
        var res;
        if (this.state.new) res = await postVolunteering(volunteeringObj);
        else res = await postVolunteering(volunteeringObj, this.state.volunteering._id);

        // Get response and send to user
        if (res.status === 200) {
            alert(`Successfully ${this.state.new ? 'added' : 'edited'} volunteering!`);
            window.location.href = `${window.location.origin}/volunteering${window.location.search}`;
        } else alert(`${this.state.new ? 'Adding' : 'Editing'} volunteering failed :(`);
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Volunteering name');
        if (this.state.club === '') invalid.push('Club name');
        if (this.state.filters.weekly && this.state.signupTime === '') invalid.push('Signup time');
        return invalid;
    };

    resetState = (volunteering, isNew = false) => {
        if (volunteering === null) volunteering = this.state.vol;
        this.setState({
            new: isNew,
            volunteering,
            name: volunteering.name,
            club: volunteering.club,
            description: volunteering.description,
            open: volunteering.filters.open,
            signupTime: volunteering.signupTime,
            filters: { ...volunteering.filters },
        });
    };

    async componentDidMount() {
        // Get id from url params
        const id = getParams('id');

        // Empty form if new
        if (id === null) {
            this.resetState(new Volunteering(), true);
            return;
        }

        // Fill form with volunteering
        const res = await getVolunteering(id);

        if (res.status === 200) this.resetState(res.data);
        else {
            alert(`Could not get volunteering with the requested ID '${id}'. Redirecting to 'new volunteering' page`);
            window.location.href = `${window.location.origin}/edit/volunteering`;
        }
    }

    render() {
        // Return loading if volunteering not got
        if (this.state.volunteering === null && !this.state.new) return <Loading></Loading>;

        // If the weekly filter is active, show edit field for signup time
        var signupTime = null;
        if (this.state.filters.weekly) {
            signupTime = (
                <>
                    <label htmlFor="signupTime">Signup Time</label>
                    <input
                        name="signupTime"
                        className="line-in signup-time-input"
                        type="text"
                        placeholder="eg. Sunday 11pm"
                        value={this.state.signupTime}
                        onChange={this.handleInputChange}
                    ></input>
                </>
            );
        }

        return (
            <div className="edit-volunteering">
                <div className="edit-volunteering-title-and-open">
                    <button
                        className={'edit-volunteering-open-switch' + (this.state.open ? ' open' : ' closed')}
                        onClick={this.changeOpen}
                    >
                        {this.state.open ? 'Open' : 'Closed'}
                    </button>
                    <input
                        name="name"
                        className="line-in edit-volunteering-name-input"
                        type="text"
                        placeholder="Volunteering name"
                        value={this.state.name}
                        onChange={this.handleInputChange}
                    ></input>
                </div>
                <label htmlFor="club">Club Name</label>
                <input
                    name="club"
                    className="line-in edit-volunteering-club-name-input"
                    type="text"
                    placeholder="Enter related club(s)"
                    value={this.state.club}
                    onChange={this.handleInputChange}
                ></input>
                <br />
                <label>Description</label>
                <br />
                <textarea
                    name="description"
                    className="edit-volunteering-description-input"
                    type="text"
                    placeholder="Enter a description for your volunteering (use http/https to hyperlink urls automatically)"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                ></textarea>
                <div className="filter-buttons">
                    <button
                        className={'vol-filter limited' + (this.state.filters.limited ? ' active' : '')}
                        onClick={() => {
                            this.changeFilter('limited');
                        }}
                    >
                        Limited Slots
                    </button>
                    <button
                        className={'vol-filter semester' + (this.state.filters.semester ? ' active' : '')}
                        onClick={() => {
                            this.changeFilter('semester');
                        }}
                    >
                        Semester Long
                    </button>
                    <button
                        className={'vol-filter set-times' + (this.state.filters.setTimes ? ' active' : '')}
                        onClick={() => {
                            this.changeFilter('setTimes');
                        }}
                    >
                        Set Volunteering Times
                    </button>
                    <button
                        className={'vol-filter weekly' + (this.state.filters.weekly ? ' active' : '')}
                        onClick={() => {
                            this.changeFilter('weekly');
                        }}
                    >
                        Weekly Signups
                    </button>
                </div>
                {signupTime}
                <SubmitGroup submit={this.submit}></SubmitGroup>
            </div>
        );
    }
}

export default EditVolunteering;
