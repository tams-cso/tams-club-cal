import React from 'react';
import './Popup.scss';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: '', id: null };
    }

    activate = (id) => {
        this.props.history.push(`${window.location.pathname}?id=${id}`);
        this.setState({ active: ' active', id });
    };

    close = () => {
        this.props.history.push(`${window.location.pathname}`);
        this.setState({ active: '' });
    };

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id == undefined || id == null) this.setState({ active: '' });
        else this.setState({ active: ' active', id });

        addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() == 'escape' && this.state.active != '') {
                this.close();
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.active != prevProps.active) {
            this.setState({ active: this.props.active ? ' active' : '' });
        }
    }

    render() {
        return (
            <div className={'Popup ' + this.state.active}>
                <div className="close-bkgd" onClick={this.close}></div>
                <div className="popup-content">{this.state.id}</div>
            </div>
        );
    }
}

export default Popup;
