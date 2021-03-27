import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from './components/menu/menu';
import About from './components/about/about';
import Clubs from './components/clubs/clubs';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Volunteering from './components/volunteering/volunteering';
import Search from './components/menu/search';
import RoutingRequests from './functions/routing-requests';
import Edit from './components/edit/edit';
import Admin from './components/admin/admin';

import './app.scss';
import Resources from './components/resources/resources';
import Auth from './components/edit/auth';
import ActionButton from './components/shared/action-button';
import Cookies from 'universal-cookie';
import { isActive } from './functions/util';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dark: false };
    }

    toggleDarkTheme = () => {
        const cookies = new Cookies();
        cookies.set('dark', !this.state.dark, { path: '/', sameSite: 'strict' });
        this.setState({ dark: !this.state.dark });
    };

    componentDidMount() {
        const cookies = new Cookies();
        const dark = cookies.get('dark');
        if (dark === undefined || dark === 'false') return;
        else this.setState({ dark: true });
    }

    render() {
        const isStaging = window.location.origin !== 'https://tams.club';
        return (
            <div className={`App ${this.state.dark ? 'dark' : ''}`}>
                <BrowserRouter>
                    <ActionButton
                        className="toggle-dark-theme"
                        onClick={this.toggleDarkTheme}
                        title="Toggle Dark Theme!"
                    >
                        !
                    </ActionButton>
                    <p className={isActive('staging-text', isStaging)}>STAGING</p>
                    <RoutingRequests />
                    <Menu />
                    <div className="page">
                        <Switch>
                            <Route exact path={['/', '/events']} component={Home} />
                            <Route exact path="/volunteering" component={Volunteering} />
                            <Route exact path="/clubs" component={Clubs} />
                            <Route exact path="/resources" component={Resources} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/search" component={Search} />
                            <Route exact path="/auth" component={Auth} />
                            <Route exact path="/admin" component={Admin} />
                            <Route path="/edit" component={Edit} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
