import React from 'react';
import ActionButton from '../shared/action-button';
import './edit-login.scss';

class EditLogin extends React.Component {
    loginWithGoogle = () => {};
    render() {
        return (
            <div className="edit-login">
                <div className="edit-login-top">
                    <h1 className="edit-login-title">EDIT MODE</h1>
                    <ActionButton className="edit-login-login-button" onClick={this.loginWithGoogle}>
                        Login with Google
                    </ActionButton>
                </div>
            </div>
        );
    }
}

export default EditLogin;
