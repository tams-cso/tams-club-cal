import React from 'react';
import { ReactComponent as WebIcon } from '../files/web.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './ClubCard.scss';

class ClubCard extends React.Component {
    render() {
        return (
            <div className="club-card" onClick={this.props.onClick}>
                <div className="club-card-image-container">
                    <div className="club-card-image-placeholder">Club Image here</div>
                    <img className="club-card-image" src={this.props.club.coverImgThumbnail} alt="club image"></img>
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
