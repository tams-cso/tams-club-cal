import React from 'react';
import './CommitteeEdit.scss';

class CommitteeEdit extends React.Component {
    render() {
        return (
            <div className="committee-edit">
                <input
                    name="name"
                    num={this.props.num}
                    className="line-in committee-edit-name-input"
                    type="text"
                    placeholder="Exec name..."
                    value={this.props.committee.name}
                    onChange={this.props.onChange}
                ></input>
                <br />
                <label htmlFor="fb" className="committee-edit-label">
                    Facebook:
                </label>
                <input
                    name="fb"
                    num={this.props.num}
                    className="line-in committee-edit-input"
                    type="text"
                    placeholder="Facebook link"
                    value={this.props.committee.fb}
                    onChange={this.props.onChange}
                ></input>
                <br />
                <label htmlFor="website" className="committee-edit-label">
                    Website:
                </label>
                <input
                    name="website"
                    num={this.props.num}
                    className="line-in committee-edit-input"
                    type="text"
                    placeholder="Website link"
                    value={this.props.committee.website}
                    onChange={this.props.onChange}
                ></input>
                <textarea
                    name="description"
                    num={this.props.num}
                    className="club-popup-description-input exec-edit-description-input"
                    type="text"
                    placeholder="Enter a short bio or description!"
                    value={this.props.committee.description}
                    onChange={this.props.onChange}
                ></textarea>
            </div>
        );
    }
}

export default CommitteeEdit;
