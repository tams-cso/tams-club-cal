import React from 'react';
import { getId } from '../functions/util';
import './Popup.scss';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: '', id: null };
    }

    activate = (id) => {
        if (window.location.pathname == '/') this.props.history.push('/event?id=' + id);
        else this.props.history.push(`${window.location.pathname}?id=${id}`);
        scrollTo(window.top);
        this.setState({ active: ' active', id }, () => {
            if (this.props.activateCallback !== undefined) this.props.activateCallback();
        });
    };

    close = () => {
        if (window.location.pathname == '/event') this.props.history.push('/');
        else this.props.history.push(`${window.location.pathname}`);
        this.setState({ active: '' }, () => {
            // TODO: On home view, set this to replace the content with 'loading...'
            if (this.props.closeCallback !== undefined) this.props.closeCallback();
        });
    };

    componentDidMount() {
        const id = getId();
        if (id == undefined || id == null) this.setState({ active: '' });
        else this.activate(id);

        addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() == 'escape' && this.state.active != '') {
                this.close();
            }
        });
    }

    render() {
        return (
            <div className={'Popup ' + this.state.active}>
                <div className="close-bkgd" onClick={this.close}></div>
                <div className="popup-content">{this.props.children}</div>
            </div>
        );
    }
}

export default Popup;
