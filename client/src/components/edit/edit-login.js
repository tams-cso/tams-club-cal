import React from 'react';
import Cookies from 'universal-cookie';
import { getAuthUrl, getIp, postRefreshAuth } from '../../functions/api';
import { ReactComponent as GoogleLogo } from '../../files/google-logo.svg';
import './edit-login.scss';
import { isActive } from '../../functions/util';
import ActionButton from '../shared/action-button';

class EditLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: 'Fetching login information...', loaded: false, loggedIn: false };
    }

    loginWithGoogle = async () => {
        const cookies = new Cookies();

        const res = await getAuthUrl();
        console.log(res.data.authUrl);
        if (res.status !== 200) {
            alert('Could not connect to login server. Please try refreshing the page :(');
            return;
        }

        cookies.set('state', res.data.state, { path: '/' });
        cookies.set('url', window.location.toString(), { path: '/' });
        window.location.href = res.data.authUrl;
    };

    logout = () => {
        const cookies = new Cookies();
        cookies.remove('auth_email', { path: '/' });
        console.log(cookies.getAll());
        window.location.href = window.location.toString();
    };

    async componentDidMount() {
        const cookies = new Cookies();
        const email = cookies.get('auth_email');

        // Fetch the IP if not logged in
        if (email === undefined) {
            const res = await getIp();
            if (res.status !== 200) {
                alert('Could not connect to the server! Please reload the page.');
                return;
            }
            this.setState({
                message: `You are not logged in. Any edits you make will be saved with your current ip address [${res.data.ip}]`,
                loaded: true,
            });
            return;
        }

        // Get name from logged in email
        // TODO: Fetch profile picture with 'picture' field of user data
        const res = await postRefreshAuth(email);
        if (res.status !== 200) {
            alert('Could not connect to the server! Please reload the page.');
            return;
        }

        // Set state of logged in
        if (this.props.setLoggedIn) this.props.setLoggedIn(true);
        this.setState({
            message: `You are logged in as ${res.data.name} (${email}).`,
            loaded: true,
            loggedIn: true,
        });
    }

    render() {
        return (
            <div className="edit-login">
                <div className="edit-login-top">
                    <h1 className="edit-login-title">{this.props.admin ? 'Admin Menu' : 'EDIT MODE'}</h1>
                    <ActionButton
                        className={isActive('edit-login-logout', this.state.loaded && this.state.loggedIn)}
                        onClick={this.logout}
                    >
                        Logout
                    </ActionButton>
                    <button
                        className={isActive('edit-login-with-google', this.state.loaded && !this.state.loggedIn)}
                        onClick={this.loginWithGoogle}
                    >
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
