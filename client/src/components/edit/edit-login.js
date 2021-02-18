import React from 'react';
import Cookies from 'universal-cookie';
import { getIp } from '../../functions/api';
import { ReactComponent as GoogleLogo } from '../../files/google-logo.svg';
import './edit-login.scss';

class EditLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: 'Fetching login information...' };
    }

    loginWithGoogle = () => {};

    async componentDidMount() {
        const cookies = new Cookies();
        const auth = cookies.get('auth_email');

        if (auth === undefined) {
            const res = await getIp();
            this.setState({
                message: `You are not logged in. Any edits you make will be saved with your current ip address [${res.data.ip}]`,
            });
        } else {
        }
    }

    render() {
        return (
            <div className="edit-login">
                <div className="edit-login-top">
                    <h1 className="edit-login-title">EDIT MODE</h1>
                    <button className="edit-login-with-google" onClick={this.loginWithGoogle}>
                        <GoogleLogo></GoogleLogo>
                        <p className="edit-login-google-text">Sign in with Google</p>
                    </button>
                </div>
                <div className="edit-login-bottom">{this.state.message}</div>
            </div>
        );
    }
}

export default EditLogin;
