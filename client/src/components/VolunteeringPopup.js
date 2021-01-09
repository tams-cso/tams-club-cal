import React from 'react';
import { postVolunteering } from '../functions/api';
import { Volunteering } from '../functions/entries';
import { formatVolunteeringFilters } from '../functions/util';
import { getPopupEdit, getPopupId, getPopupOpen, getPopupVolunteering } from '../redux/selectors';
import { setPopupOpen, setPopupId, setPopupEdit } from '../redux/actions';
import ActionButton from './ActionButton';
import './VolunteeringPopup.scss';
import { connect } from 'react-redux';

class VolunteeringPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, name: '', club: '', description: '', filters: {} };
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

    openEdit = () => {
        this.props.setPopupEdit(true);
    };

    closeEdit = () => {
        this.props.setPopupEdit(false);
        this.resetState();
    }

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

        // POST volunteering
        // TODO: Add check for 200 status
        await postVolunteering(
            new Volunteering(
                this.state.name,
                this.state.club,
                this.state.description,
                filters,
                this.state.signupTime || null
            ),
            this.props.vol._id
        );
        this.props.setPopupEdit(false);
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Volunteering name');
        if (this.state.club === '') invalid.push('Club name');
        if (this.state.filters.weekly && this.state.signupTime === '') invalid.push('Signup time');
        return invalid;
    };

    resetState = () => {
        this.setState({
            name: this.props.vol.name,
            club: this.props.vol.club,
            description: this.props.vol.description,
            open: this.props.vol.filters.open,
            signupTime: this.props.vol.signupTime,
            filters: { ...this.props.vol.filters },
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.vol !== this.props.vol && this.props.vol !== undefined) {
            this.resetState();
        }
    }

    render() {
        if (this.props.vol === null || this.props.vol === undefined) return <div className="VolunteeringPopup"></div>;

        // Get a list of filters
        var filters = formatVolunteeringFilters(this.props.vol.filters, this.props.vol.signupTime);

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
                        value={this.state.signupTime}
                        onChange={this.handleInputChange}
                    ></input>
                </>
            );
        }

        return (
            <div className="VolunteeringPopup">
                <div className={'display' + (!this.props.edit ? ' active' : ' inactive')}>
                    {this.props.vol.filters.open ? (
                        <p className="res-popup-open open">Open</p>
                    ) : (
                        <p className="res-popup-open closed">Closed</p>
                    )}
                    <p className="res-popup-name">{this.props.vol.name}</p>
                    <p className="res-popup-club">{this.props.vol.club}</p>
                    <p className="res-popup-description">{this.props.vol.description}</p>
                    {filters}
                    <ActionButton onClick={this.openEdit}>Edit</ActionButton>
                </div>
                <div className={'edit' + (this.props.edit ? ' active' : ' inactive')}>
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

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
        vol: getPopupVolunteering(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit };

export default connect(mapStateToProps, mapDispatchToProps)(VolunteeringPopup);
