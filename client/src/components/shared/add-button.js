import React from 'react';
import './add-button.scss';

class AddButton extends React.Component {
    openAdd = () => {
        window.location.href = `${window.location.origin}/edit/${this.props.type}`;
    };

    render() {
        return (
            <button className="add-button" onClick={this.openAdd}>
                +
            </button>
        );
    }
}

export default AddButton;
