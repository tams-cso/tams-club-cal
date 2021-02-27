import React from 'react';

class AddButton extends React.Component {
    openAdd = () => {
        window.location.href = `${window.location.origin}/edit/${this.props.type}`;
    };

    render() {
        return (
            <button className="add-button" onClick={this.openAdd}>
                Add
            </button>
        );
    }
}

export default AddButton;
