import React from 'react';
import './add-button.scss';

class AddButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '+' };
    }

    openAdd = () => {
        window.location.href = `${window.location.origin}/edit${window.location.pathname}`;
    };

    hoverEvent = (enter) => {
        var text = '+';
        if (enter) text = `+ Add ${this.props.type}`;
        this.setState({ text });
    };

    render() {
        return (
            <button
                className={`add-button ${this.props.className} ${this.props.type.toLowerCase()}`}
                onClick={this.openAdd}
                onMouseEnter={this.hoverEvent.bind(this, true)}
                onMouseLeave={this.hoverEvent.bind(this, false)}
            >
                <div className="add-button-text">{this.state.text}</div>
            </button>
        );
    }
}

export default AddButton;
