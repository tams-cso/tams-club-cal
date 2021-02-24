import React from 'react';
import ActionButton from './action-button';
import { returnToLastLocation } from '../../functions/util';
import './submit-group.scss';

class SubmitGroup extends React.Component {
    render() {
        return (
            <div className={`submit-group ${this.props.className || ''}`}>
                <ActionButton className="cancel" onClick={returnToLastLocation.bind(this, window.location)}>
                    Cancel
                </ActionButton>
                <ActionButton className="submit" onClick={this.props.submit}>
                    Submit
                </ActionButton>
            </div>
        );
    }
}

export default SubmitGroup;
