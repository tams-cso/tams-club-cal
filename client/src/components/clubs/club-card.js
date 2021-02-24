import React from 'react';
import IconGroup from '../shared/icon-group';
import { imgUrl } from '../../functions/util';
import './club-card.scss';

class ClubCard extends React.Component {
    render() {
        return (
            <div className="club-card" onClick={this.props.onClick}>
                <div className="club-card-image-container">
                    <div className="club-card-image-placeholder"></div>
                    <img
                        className="club-card-image"
                        src={imgUrl(this.props.club.coverImgThumbnail)}
                        alt="club image"
                    ></img>
                </div>
                <div className={'club-card-type' + (!this.props.club.advised ? ' club-card-independent' : '')}>
                    {this.props.club.advised ? 'Advised' : 'Independent'}
                </div>
                <div className="club-card-name">{this.props.club.name}</div>
                <IconGroup
                    className="club-card-icons"
                    fb={this.props.club.fb}
                    website={this.props.club.website}
                ></IconGroup>
            </div>
        );
    }
}

export default ClubCard;
