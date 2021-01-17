import React from 'react';
import { imgUrl } from '../functions/util';
import './ExecEdit.scss';
import ImageUpload from './ImageUpload';

class ExecEdit extends React.Component {
    render() {
        var execImg = this.props.exec.img;
        if (execImg.startsWith('/')) execImg = imgUrl(execImg);
        return (
            <div className="exec-edit">
                <div className="exec-edit-left">
                    <img
                        className="exec-img exec-edit-img"
                        id={`exec-img-${this.props.num}`}
                        src={execImg}
                        alt="profile pic"
                    ></img>
                    <ImageUpload
                        className="exec-edit-img-upload"
                        name={`exec-edit-img-upload-${this.props.num}`}
                        onChange={this.props.onImgChange}
                    ></ImageUpload>
                </div>
                <div className="exec-edit-right">
                    <input
                        name="name"
                        num={this.props.num}
                        className="line-in exec-edit-name-input"
                        type="text"
                        placeholder="Exec name..."
                        value={this.props.exec.name}
                        onChange={this.props.onChange}
                    ></input>
                    <br />
                    <label htmlFor="position" className="exec-edit-position-label">
                        Position:
                    </label>
                    <input
                        name="position"
                        num={this.props.num}
                        className="line-in exec-edit-position-input"
                        type="text"
                        placeholder="Exec position (eg. President)"
                        value={this.props.exec.position}
                        onChange={this.props.onChange}
                    ></input>
                    <textarea
                        name="description"
                        num={this.props.num}
                        className="club-popup-description-input exec-edit-description-input"
                        type="text"
                        placeholder="Enter a short bio or description!"
                        value={this.props.exec.description}
                        onChange={this.props.onChange}
                    ></textarea>
                </div>
            </div>
        );
    }
}

export default ExecEdit;
