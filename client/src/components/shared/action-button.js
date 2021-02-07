import React from 'react';
import './action-button.scss';

class ActionButton extends React.Component {
    render() {
        return (
            <button className={`action-button ${this.props.className}`} onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export default ActionButton;
