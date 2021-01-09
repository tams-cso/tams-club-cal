import React from 'react';
import { ReactComponent as GlobeIcon } from '../files/globe.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './ClubCard.scss';

class ClubCard extends React.Component {
    render() {
        return (
            <div className="ClubCard" onClick={this.props.onClick}>
                <div className="image-box">
                    {/* TODO: Detect bad image url */}
                    <div className="image-placeholder" style={this.props.club.coverImg != '' ? { display: 'none' } : {}}>
                        Club Image here
                    </div>
                    <img className="club-image" src={this.props.club.coverImgThumbnail} alt="club image"></img>
                </div>
                <div className={'club-type' + (this.props.club.advised != 'true' ? ' club-indp' : '')}>
                    {this.props.club.advised == 'true' ? 'Advised' : 'Independent'}
                </div>
                <div className="club-name">{this.props.club.name}</div>
                <div className="club-icons">
                    <GlobeIcon
                        onClick={() => {
                            if (this.props.club.website != '') window.open(this.props.club.website);
                        }}
                    ></GlobeIcon>
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
