import React from 'react';
import ActionButton from './action-button';
import { isActive, returnToLastLocation } from '../../functions/util';
import './submit-group.scss';

class SubmitGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { submitted: false };
    }
    submit = async () => {
        this.setState({ submitted: true });
        const res = await this.props.submit();
        if (!res) this.setState({ submitted: false });
    };
    render() {
        return (
            <div className={`submit-group ${this.props.className}`}>
                <div className={isActive('submit-group-buttons', !this.state.submitted)}>
                    <ActionButton className="cancel" onClick={returnToLastLocation.bind(this, window.location)}>
                        Cancel
                    </ActionButton>
                    <ActionButton className="submit" onClick={this.submit}>
                        Submit
                    </ActionButton>
                </div>
                <p className={isActive('submit-group-post-message', this.state.submitted)}>
                    Uploading edits... please do not reload or close this page!
                </p>
            </div>
        );
    }
}

export default SubmitGroup;
