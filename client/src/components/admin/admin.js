import React from 'react';
import Cookies from 'universal-cookie';
import EditLogin from '../edit/edit-login';
import AdminContent from './admin-content';
import { postTrustedAuth } from '../../functions/api';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loggedIn: false };
    }

    setLoggedIn = async (loggedIn) => {
        if (!loggedIn) {
            this.setState({ loggedIn });
            return;
        }

        const cookies = new Cookies();
        const email = cookies.get('auth_email');
        const res = await postTrustedAuth(email);
        if (res.data.trusted) this.setState({ loggedIn });
    };

    render() {
        return (
            <div className="admin">
                <EditLogin admin setLoggedIn={this.setLoggedIn}></EditLogin>
                {this.state.loggedIn ? <AdminContent></AdminContent> : <h1>Access denied.</h1>}
            </div>
        );
    }
}

export default Admin;
