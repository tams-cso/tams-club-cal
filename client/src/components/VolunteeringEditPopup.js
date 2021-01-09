import React from 'react';
import './VolunteeringEditPopup.scss';

class VolunteeringEditPopup extends React.Component {
    render() {
        return (
            <div className="VolunteeringEditPopup" onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}

export default VolunteeringEditPopup;
