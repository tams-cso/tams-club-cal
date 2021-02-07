import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';

import { postVolunteering } from '../../functions/api';
import { Volunteering } from '../../functions/entries';
import { formatVolunteeringFilters, getOrFetchVolList } from '../../functions/util';
import { getPopupEdit, getPopupId, getPopupOpen, getPopupNew, getSavedVolunteeringList } from '../../redux/selectors';
import {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    updateVolunteering,
    setPopupNew,
    addVolunteering,
} from '../../redux/actions';

import './volunteering-popup.scss';

class VolunteeringPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, name: '', club: '', description: '', filters: {} };
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

    openEdit = () => {
        this.props.setPopupEdit(true);
    };

    closeEdit = () => {
        this.props.setPopupEdit(false);
        if (this.props.new) this.props.setPopupOpen(false);
        this.resetState(null);
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

        // POST volunteering
        // TODO: Add check for 200 status
        var volunteeringObj = new Volunteering(
            this.state.name,
            this.state.club,
            this.state.description,
            filters,
            this.state.signupTime || null
        );

        if (this.props.id === 'new') {
            var id = await postVolunteering(volunteeringObj);
            volunteeringObj._id = id;
            this.props.addVolunteering(volunteeringObj);
        } else {
            await postVolunteering(volunteeringObj, this.state.vol._id);
            this.props.updateVolunteering(this.state.vol._id, volunteeringObj);
        }

        this.setState({ vol: volunteeringObj });
        this.props.setPopupEdit(false);
    };

    testValid = () => {
        var invalid = [];
        if (this.state.name === '') invalid.push('Volunteering name');
        if (this.state.club === '') invalid.push('Club name');
        if (this.state.filters.weekly && this.state.signupTime === '') invalid.push('Signup time');
        return invalid;
    };

    getVol = async () => {
        if (this.props.volList === null) {
            getOrFetchVolList();
            return;
        }
        const vol = this.props.volList.find((v) => v._id === this.props.id);
        this.resetState(vol);
    };

    resetState = (vol) => {
        if (vol === null) vol = this.state.vol;
        this.setState({
            vol,
            name: vol.name,
            club: vol.club,
            description: vol.description,
            open: vol.filters.open,
            signupTime: vol.signupTime,
            filters: { ...vol.filters },
        });
    };

    componentDidMount() {
        if (this.props.id === null || this.props.id === undefined || !this.props.popupOpen) return;
        if (this.props.new) {
            this.resetState(new VolunteeringDefault());
        } else {
            this.getVol();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.id !== this.props.id &&
            this.props.id !== undefined &&
            this.props.id !== null &&
            this.props.popupOpen
        ) {
            if (this.props.new) {
                this.resetState(new Volunteering());
            } else {
                this.getVol();
            }
        } else if (prevProps.volList !== this.props.volList && this.props.popupOpen && !this.props.new) this.getVol();
    }

    render() {
        // Return empty div if the current popup is not defined
        if (this.state.vol === null || this.state.vol === undefined) return <div className="VolunteeringPopup"></div>;

        // Get a list of filters
        var filters = formatVolunteeringFilters(this.state.vol.filters, this.state.vol.signupTime);

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
                    {this.state.vol.filters.open ? (
                        <p className="res-popup-open open">Open</p>
                    ) : (
                        <p className="res-popup-open closed">Closed</p>
                    )}
                    <p className="res-popup-name">{this.state.vol.name}</p>
                    <p className="res-popup-club">{this.state.vol.club}</p>
                    <p className="res-popup-description">{this.state.vol.description}</p>
                    {filters}
                    <ActionButton className="res-popup-edit" onClick={this.openEdit}>
                        Edit
                    </ActionButton>
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
        new: getPopupNew(state),
        volList: getSavedVolunteeringList(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit, updateVolunteering, setPopupNew, addVolunteering };

export default connect(mapStateToProps, mapDispatchToProps)(VolunteeringPopup);
