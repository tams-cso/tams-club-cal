import React from 'react';
import { postVolunteering } from '../functions/api';
import { Volunteering } from '../functions/entries';
import { formatVolunteeringFilters, getParams } from '../functions/util';
import ActionButton from './ActionButton';
import './VolunteeringPopup.scss';

class VolunteeringPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, open: false, name: '', club: '', description: '', filters: {} };
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    closeEdit = () => {
        this.setState({ edit: false });
    };

    edit = () => {
        this.setState({ edit: true });
    };

    changeFilter = (filter) => {
        var filterList = this.state.filters;
        filterList[filter] = !filterList[filter];
        this.setState({ filters: filterList });
    };

    changeOpen = () => {
        this.setState({ open: !this.state.open });
    };

    submit = () => {
        var invalid = this.testValid();
        if (invalid.length === 0) {
            // Updated 'open' filter
            var filters = this.state.filters;
            filters['open'] = this.state.open;

            // POST volunteering
            postVolunteering(
                new Volunteering(
                    this.state.name,
                    this.state.club,
                    this.state.description,
                    filters,
                    this.state.signupTime || null
                ),
                this.props.vol._id
            ).then(() => {
                this.closeEdit();
                // TODO: Find more permanant solution LMAO
                alert('Volunteering opportunity updated!');
                window.location.reload();
            });
        } else {
            var message = '';
            invalid.forEach((i) => (message += `${i} cannot be empty!\n`));
            alert(message);
        }
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Volunteering name');
        if (this.state.club === '') invalid.push('Club name');
        if (this.state.filters.weekly && this.state.signupTime === '') invalid.push('Signup time');
        return invalid;
    };

    componentDidMount() {
        if (this.props.vol === null) return;

        this.setState({
            open: this.props.vol.filters.open === 'true',
            name: this.props.vol.name,
            club: this.props.vol.club,
            description: this.props.vol.description,
            open: this.props.vol.filters.open,
            signupTime: this.props.vol.signupTime,
            filters: { ...this.props.vol.filters },
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.vol !== this.props.vol) {
            this.setState({
                name: this.props.vol.name,
                club: this.props.vol.club,
                description: this.props.vol.description,
                open: this.props.vol.filters.open,
                signupTime: this.props.vol.signupTime,
                filters: { ...this.props.vol.filters },
            });
        }
    }

    render() {
        if (this.props.vol === null) return <div className="VolunteeringPopup"></div>;
        var filters = formatVolunteeringFilters(this.props.vol.filters, this.props.vol.signupTime);
        var signupTime = null;
        if (this.state.filters.weekly) {
            signupTime = (
                <>
                    <label htmlFor="signupTime">Signup Time</label>
                    <input
                        name="signupTime"
                        className="line-in signup-time-input"
                        type="text"
                        value={this.state.signupTime}
                        onChange={this.handleInputChange}
                    ></input>
                </>
            );
        }
        return (
            <div className="VolunteeringPopup">
                <div className={'display' + (!this.state.edit ? ' active' : ' inactive')}>
                    {this.props.vol.filters.open ? (
                        <p className="res-popup-open open">Open</p>
                    ) : (
                        <p className="res-popup-open closed">Closed</p>
                    )}
                    <p className="res-popup-name">{this.props.vol.name}</p>
                    <p className="res-popup-club">{this.props.vol.club}</p>
                    <p className="res-popup-description">{this.props.vol.description}</p>
                    {filters}
                    <ActionButton onClick={this.edit}>Edit</ActionButton>
                </div>
                <div className={'edit' + (this.state.edit ? ' active' : ' inactive')}>
                    <div className="title-and-open">
                        <div className="title">
                            <input
                                name="name"
                                className="line-in name-input"
                                type="text"
                                placeholder="Volunteering name"
                                value={this.state.name}
                                onChange={this.handleInputChange}
                            ></input>
                        </div>
                        <button
                            className={'open-switch' + (this.state.open ? ' open' : ' closed')}
                            onClick={this.changeOpen}
                        >
                            {this.state.open ? 'Open' : 'Closed'}
                        </button>
                    </div>
                    <label htmlFor="club">Club Name</label>
                    <input
                        name="club"
                        className="line-in club-name-input"
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
                        className="description-input"
                        type="text"
                        placeholder="Enter a description for your event"
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
                    <div className="action-button-box">
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

export default VolunteeringPopup;
