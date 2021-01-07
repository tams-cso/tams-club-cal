import React from 'react';
import { ReactComponent as GlobeIcon } from '../files/globe.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './CommitteeCard.scss';

class CommitteeCard extends React.Component {
    render() {
        return (
            <div className="CommitteeCard">
                <div className="committee-name">{this.props.committee.name}</div>
                <div className="committee-description">{this.props.committee.description}</div>
                <div className="committee-icons">
                    <GlobeIcon
                        onClick={() => {
                            if (this.props.committee.website != '') window.open(this.props.committee.website);
                        }}
                    ></GlobeIcon>
                    <FbIcon
                        onClick={() => {
                            if (this.props.committee.fb != '') window.open(this.props.committee.fb);
                        }}
                    ></FbIcon>
                </div>
            </div>
        );
    }
}

export default CommitteeCard;
