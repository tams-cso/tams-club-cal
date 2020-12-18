import React from 'react';
import { ReactComponent as GlobeIcon } from '../files/globe.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './ClubCard.scss';

class ClubCard extends React.Component {
    render() {
        return (
            <div className="ClubCard">
                <div className="image-box">
                    {/* TODO: Detect bad image url */}
                    <div className="image-placeholder" style={this.props.coverImg != '' ? { display: 'none' } : {}}>
                        Club Image here
                    </div>
                    <img className="club-image" src={this.props.coverImg} alt="club image"></img>
                </div>
                <div className={'club-type' + (this.props.advised != 'true' ? ' club-indp' : '')}>
                    {this.props.advised == 'true' ? 'Advised' : 'Independent'}
                </div>
                <div className="club-name">{this.props.name}</div>
                <GlobeIcon
                    onClick={() => {
                        if (this.props.website != '') window.open(this.props.website);
                    }}
                ></GlobeIcon>
                <FbIcon
                    onClick={() => {
                        if (this.props.fb != '') window.open(this.props.fb);
                    }}
                ></FbIcon>
            </div>
        );
    }
}

export default ClubCard;
