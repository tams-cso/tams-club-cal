import React from 'react';
import { getParams } from '../functions/util';
import { getPopupEdit, getPopupId, getPopupOpen } from '../redux/selectors';
import { setPopupOpen, setPopupId, setPopupEdit, resetPopupState } from '../redux/actions';
import './Popup.scss';
import { connect } from 'react-redux';

class Popup extends React.Component {
    activate = (id) => {
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
    };

    close = () => {
        if (window.location.pathname == '/event') this.props.history.push('/');
        else this.props.history.push(`${window.location.pathname}`);
        this.props.resetPopupState();
    };

    componentDidMount() {
        const id = getParams('id');
        if (id !== undefined && id !== null) this.activate(id);

        addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() == 'escape' && this.props.open) {
                this.close();
            }
        });

        this.unlisten = this.props.history.listen(() => {
            const id = getParams('id');
            if (id !== undefined && id !== null) this.activate(id);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return (
            <div className={`Popup ${this.props.open ? 'active' : ''} ${this.props.noscroll ? 'noscroll' : ''}`}>
                <div className="close-bkgd" onClick={this.close}></div>
                <div className="popup-content">{this.props.children}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit, resetPopupState };

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
