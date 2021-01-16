import React from 'react';
import { imgUrl } from '../functions/util';
import './ExecCard.scss';

class ExecCard extends React.Component {
    render() {
        return (
            <div className="ExecCard">
                <img className="exec-img" src={imgUrl(this.props.exec.img)} alt="profile pic"></img>
                <div className="info">
                    <div className="name-position-group">
                        <div className="name">{this.props.exec.name}</div>
                        <div className="position">{this.props.exec.position}</div>
                    </div>
                    <div className="description">{this.props.exec.description}</div>
                </div>
            </div>
        );
    }
}

export default ExecCard;
