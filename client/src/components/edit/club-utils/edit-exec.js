import React from 'react';
import ImageUpload from './image-upload';
import Image from '../../shared/image';
import { imgUrl } from '../../../functions/util';

import { ReactComponent as TrashIcon } from '../../files/trash-can.svg';

const EditExec = () => {
    return (
        <div className="exec-edit">
            <div className="exec-edit-left">
                <Image
                    className="exec-img exec-edit-img"
                    id={`exec-img-${this.props.num}`}
                    src={imgUrl(this.props.exec.img)}
                    alt="profile pic"
                    default={'/default-profile.png'}
                ></Image>
                <ImageUpload
                    className="exec-edit-img-upload"
                    name={`exec-edit-img-upload-${this.props.num}`}
                    onChange={this.props.onImgChange}
                ></ImageUpload>
            </div>
            <div className="exec-edit-right">
                <div className="exec-edit-name-trash-container">
                    <input
                        name="name"
                        num={this.props.num}
                        className="line-in exec-edit-name-input"
                        type="text"
                        placeholder="Exec name..."
                        value={this.props.exec.name}
                        onChange={this.props.onChange}
                    ></input>
                    <TrashIcon className="trash-icon exec-edit-trash-icon" onClick={this.props.onDelete} />
                </div>
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
};

export default EditExec;
