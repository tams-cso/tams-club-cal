import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';
class NotFound extends React.Component {
    constructor(props) { 
        super(props);
        if(window.location.pathname !== '/pagenotfound')this.props.history.push('/pagenotfound');
    }
    
    render() {
        return <div className="error-message">
                <h3>The page you are trying to access could not be found 😔</h3>

                    But here are some cool pages that you could go to 😃
                    <br/>
                    <ul  >
                        <li><Link className="page-not-found-nav-item" to='/'>Homepage <span className="helper-text">(has the events)  ➡️</span></Link></li>
                        <li><Link className="page-not-found-nav-item" to='/resources'>Resources <span className="helper-text">(with links and volunteering opportunities)  ➡️</span></Link></li>
                        <li><Link className="page-not-found-nav-item" to='/clubs'>Clubs <span className="helper-text">(all the clubs at TAMS)  ➡️</span></Link></li>
                        <li><Link className="page-not-found-nav-item" to='/about'>About <span className="helper-text">(what is this site about and feedback form here)  ➡️</span></Link></li>
                        
                    </ul>
            </div>;
    }
}

export default NotFound;
