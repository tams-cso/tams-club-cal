import React from 'react';
import { connect } from 'react-redux';

import { isActive } from '../../functions/util';
import { getPopupEdit, getPopupId, getPopupOpen, getPopupNew, getPopupDeleted, getPopupType } from '../../redux/selectors';
import {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    resetPopupState,
    setPopupNew,
    deleteSavedClub,
} from '../../redux/actions';

import './popup.scss';

class Popup extends React.Component {
    close = () => {
        if (window.location.pathname == '/event') this.props.history.push('/');
        else this.props.history.push(`${window.location.pathname}`);
        this.props.resetPopupState();
    };

    componentDidMount() {
        addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() == 'escape' && this.props.open) {
                this.close();
            }
        });
    }

    componentDidUpdate() {
        if (this.props.deleted) {
            if (this.props.type === 'club') {
                this.props.deleteSavedClub(this.props.id);
                this.props.history.push('/clubs');
            }
            this.props.resetPopupState();
        }
    }

    render() {
        return (
            <div className={`popup ${isActive('', this.props.open)} ${this.props.noscroll ? 'noscroll' : ''}`}>
                <div className="popup-close-bkgd" onClick={this.close}></div>
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
        new: getPopupNew(state),
        deleted: getPopupDeleted(state),
        type: getPopupType(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit, resetPopupState, setPopupNew, deleteSavedClub };

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
