import React from 'react';
import { formatVolunteeringFilters } from '../../functions/util';
import './volunteering-card.scss';

class VolunteeringCard extends React.Component {
    render() {
        // TODO: Convert millisecond signup time to [Sunday 11:00pm]
        var filterObjects = formatVolunteeringFilters(this.props.vol.filters, this.props.vol.signupTime);
        return (
            <div className="VolunteeringCard" onClick={this.props.onClick}>
                <div className={'overlay' + (!this.props.vol.filters.open ? ' overlay-closed' : '')}>
                    <div className={'card-status status-' + (this.props.vol.filters.open ? 'open' : 'closed')}>
                        {this.props.vol.filters.open ? 'Open' : 'Closed'}
                    </div>
                    <div className="card-name">{this.props.vol.name}</div>
                    <div className="club-name">{this.props.vol.club}</div>
                    <div className="description">{this.props.vol.description.substring(0, 36) + '...'}</div>
                    <div className="filter-list">{filterObjects}</div>
                </div>
            </div>
        );
    }
}

export default VolunteeringCard;
