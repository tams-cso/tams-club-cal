import React from 'react';
import { connect } from 'react-redux';

import { isActive } from '../../functions/util';
import { getPopupOpen } from '../../redux/selectors';
import { resetPopupState } from '../../redux/actions';

import './popup.scss';

class Popup extends React.Component {
    close = () => {
        this.props.history.push(`${window.location.pathname}`);
        this.props.resetPopupState();
    };

    componentDidMount() {
        addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() == 'escape' && this.props.open) {
                this.close();
            }
        });
    }

    render() {
        return (
            <div className={`popup ${isActive('', this.props.open)}`}>
                <div className="popup-close-bkgd" onClick={this.close}></div>
                <div className="popup-content">{this.props.children}</div>
                <button className="popup-close-button" onClick={this.close}>
                    x
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        open: getPopupOpen(state),
    };
};
const mapDispatchToProps = { resetPopupState };

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
