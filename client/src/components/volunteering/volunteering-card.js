import React from 'react';
import { formatVolunteeringFilters } from '../../functions/util';
import './volunteering-card.scss';

class VolunteeringCard extends React.Component {
    render() {
        // TODO: Convert millisecond signup time to [Sunday 11:00pm]
        var filterObjects = formatVolunteeringFilters(this.props.vol.filters, this.props.vol.signupTime);
        return (
            <div className="volunteering-card" onClick={this.props.onClick}>
                <div className={'volunteering-card-overlay' + (!this.props.vol.filters.open ? ' overlay-closed' : '')}>
                    <div
                        className={
                            'volunteering-card-status status ' + (this.props.vol.filters.open ? 'open' : 'closed')
                        }
                    >
                        {this.props.vol.filters.open ? 'Open' : 'Closed'}
                    </div>
                    <p className="volunteering-card-name">{this.props.vol.name}</p>
                    <p className="volunteering-card-club-name">{this.props.vol.club}</p>
                    <p className="volunteering-card-description">
                        {this.props.vol.description.substring(0, 36) + '...'}
                    </p>
                    <div className="volunteering-card-filter-list">{filterObjects}</div>
                </div>
            </div>
        );
    }
}

export default VolunteeringCard;
