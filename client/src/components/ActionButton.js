import React from 'react';
import './ActionButton.scss';

class ActionButton extends React.Component {
    render() {
        return (
            <div className="ActionButton" onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}

export default ActionButton;
