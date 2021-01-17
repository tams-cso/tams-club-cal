import React from 'react';
import './ImageUpload.scss';

class ImageUpload extends React.Component {
    render() {
        return (
            <div className={`image-upload ${this.props.className}`}>
                <label className="image-upload-button" htmlFor={this.props.name}>
                    Change
                </label>
                <input
                    id={this.props.name}
                    name={this.props.name}
                    type="file"
                    accept="image/*"
                    className="image-upload-input"
                    onChange={this.props.onChange}
                ></input>
            </div>
        );
    }
}

export default ImageUpload;
