import React from 'react';
import IconGroup from '../shared/icon-group';
import './committee-card.scss';

class CommitteeCard extends React.Component {
    render() {
        return (
            <div className="committee-card">
                <div className="committee-card-name">{this.props.committee.name}</div>
                <div className="committee-card-description">{this.props.committee.description}</div>
                <IconGroup
                    className="committee-card-icons"
                    fb={this.props.committee.fb}
                    website={this.props.committee.website}
                ></IconGroup>
            </div>
        );
    }
}

export default CommitteeCard;
