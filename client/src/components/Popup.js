import React from 'react';
import './Popup.scss';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: '' };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.active != prevProps.active) {
            this.setState({ active: this.props.active ? ' active' : '' });
        }
    }

    render() {
        return (
            <div className={'Popup ' + this.state.active}>
                <div className="close-bkgd" onClick={this.props.close}></div>
                <div className="popup-content">{this.props.id}</div>
            </div>
        );
    }
}

export default Popup;
