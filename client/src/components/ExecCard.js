import React from 'react';
import { imgUrl } from '../functions/util';
import './ExecCard.scss';

class ExecCard extends React.Component {
    render() {
        return (
            <div className="exec-card">
                <img className="exec-img" src={imgUrl(this.props.exec.img)} alt="profile pic"></img>
                <div className="exec-card-info">
                    <div className="exec-card-name-position-group">
                        <div className="exec-card-name">{this.props.exec.name}</div>
                        <div className="exec-card-position">{this.props.exec.position}</div>
                    </div>
                    <div className="exec-card-description">{this.props.exec.description}</div>
                </div>
            </div>
        );
    }
}

export default ExecCard;
