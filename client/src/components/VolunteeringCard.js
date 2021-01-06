import React from 'react';
import { formatVolunteeringFilters } from '../functions/util';
import './VolunteeringCard.scss';

class VolunteeringCard extends React.Component {
    render() {
        // TODO: Convert millisecond signup time to [Sunday 11:00pm]
        var filterObjects = formatVolunteeringFilters(this.props.filters, this.props.signupTime)
        return (
            <div className="VolunteeringCard" onClick={this.props.onClick}>
                <div className={'overlay' + (!this.props.filters.open ? ' overlay-closed' : '')}>
                    <div className={'card-status status-' + (this.props.filters.open ? 'open' : 'closed')}>
                        {this.props.filters.open ? 'Open' : 'Closed'}
                    </div>
                    <div className="card-name">{this.props.name}</div>
                    <div className="club-name">{this.props.club}</div>
                    <div className="description">{this.props.description.substring(0, 36) + '...'}</div>
                    <div className="filter-list">{filterObjects}</div>
                </div>
            </div>
        );
    }
}

export default VolunteeringCard;
