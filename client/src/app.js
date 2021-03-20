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

function App() {
    return (
        <div className="App">
            <BrowserRouter>
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

export default App;
