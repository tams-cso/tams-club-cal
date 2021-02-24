import React from 'react';
import Cookies from 'universal-cookie';
import { postAuth } from '../../functions/api';
import { getParams } from '../../functions/util';
import './auth.scss';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: 'Verifying login...', subMessage: '' };
    }

    showError = (url = null) => {
        // Redirect user
        setTimeout(() => {
            window.location.href = url || window.location.origin;
        }, 3000);

        // Save message
        this.setState({
            message: 'Login is invalid or has timed out! Please try logging in again.',
            subMessage: 'Redirecting in 3 seconds...',
        });
    };

    async componentDidMount() {
        const cookies = new Cookies();
        const savedState = cookies.get('state');
        const url = cookies.get('url');

        if (savedState === undefined || url === undefined) {
            this.showError(url);
            return;
        }

        const code = getParams('code');
        const state = getParams('state');
        if (code === null || state === null || savedState !== state) {
            this.showError(url);
            return;
        }

        // POST the code
        const res = await postAuth(code);
        if (res.status !== 200) {
            this.showError(url);
            return;
        }

        // Reset cookies and add email to auth cookie
        cookies.remove('url', { path: '/' });
        cookies.remove('state', { path: '/' });
        cookies.set('auth_email', res.data.email, { path: '/' });

        // Redirect back!
        window.location.href = url;
    }

    render() {
        return (
            <div className="auth">
                <p className="auth-message">{this.state.message}</p>
                <p className="auth-submessage">{this.state.subMessage}</p>
            </div>
        );
    }
}

export default Auth;
