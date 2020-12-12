import React from 'react';
import './VolunteeringCard.scss';

class VolunteeringCard extends React.Component {
    render() {
        var filterObjects = [];
        if (this.props.filters.limited)
            filterObjects.push(
                <div key="0" className="filter f-limited">
                    Limited Slots
                </div>
            );
        if (this.props.filters.semester)
            filterObjects.push(
                <div key="1" className="filter f-semester">
                    Semester Long Commitment
                </div>
            );
        if (this.props.filters.setTimes)
            filterObjects.push(
                <div key="2" className="filter f-set-times">
                    Set Volunteering Times
                </div>
            );
        if (this.props.filters.weekly)
            filterObjects.push(
                <div key="3" className="filter f-weekly">
                    Weekly Signups [{this.props.signupTime}]
                </div>
            );
        return (
            <div className="VolunteeringCard">
                <div className={'overlay' + (!this.props.filters.open ? ' overlay-closed' : '')}>
                    <div className={'card-status status-' + (this.props.filters.open ? 'open' : 'closed')}>
                        {this.props.filters.open ? 'Open' : 'Closed'}
                    </div>
                    <div className="card-name">{this.props.name}</div>
                    <div className="club-name">{this.props.club}</div>
                    <div className="description">{this.props.description.substring(0, 36) + "..."}</div>
                    <div className="filter-list">{filterObjects}</div>
                </div>
            </div>
        );
    }
}

export default VolunteeringCard;
