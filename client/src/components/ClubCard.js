import React from 'react';
import { ReactComponent as WebIcon } from '../files/web.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './ClubCard.scss';
import { imgUrl } from '../functions/util';

class ClubCard extends React.Component {
    render() {
        var thumbnail = this.props.club.coverImgThumbnail;
        if (thumbnail.startsWith('/')) thumbnail = imgUrl(thumbnail);
        return (
            <div className="club-card" onClick={this.props.onClick}>
                <div className="club-card-image-container">
                    <div className="club-card-image-placeholder"></div>
                    <img className="club-card-image" src={thumbnail} alt="club image"></img>
                </div>
                <div className={'club-card-type' + (this.props.club.advised != 'true' ? ' club-card-independent' : '')}>
                    {this.props.club.advised == 'true' ? 'Advised' : 'Independent'}
                </div>
                <div className="club-card-name">{this.props.club.name}</div>
                <div className="club-card-icons">
                    <WebIcon
                        onClick={() => {
                            if (this.props.club.website != '') window.open(this.props.club.website);
                        }}
                    ></WebIcon>
                    <FbIcon
                        onClick={() => {
                            if (this.props.club.fb != '') window.open(this.props.club.fb);
                        }}
                    ></FbIcon>
                </div>
            </div>
        );
    }
}

export default ClubCard;
