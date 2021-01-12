import React from 'react';
import { ReactComponent as WebIcon } from '../files/web.svg';
import { ReactComponent as FbIcon } from '../files/fb.svg';
import './CommitteeCard.scss';

class CommitteeCard extends React.Component {
    render() {
        return (
            <div className="CommitteeCard">
                <div className="committee-name">{this.props.committee.name}</div>
                <div className="committee-description">{this.props.committee.description}</div>
                {/* TODO: Extract this to a component bc it's used by club card as well? */}
                {/* TODO: Change the font of the tiny text on the committee card? */}
                <div className="committee-icons">
                    <WebIcon
                        onClick={() => {
                            if (this.props.committee.website != '') window.open(this.props.committee.website);
                        }}
                    ></WebIcon>
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
