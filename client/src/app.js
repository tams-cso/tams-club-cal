import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from './components/menu/menu';
import About from './components/about/about';
import Add from './components/add-event/add';
import Clubs from './components/clubs/clubs';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Resources from './components/resources/resources';
import Search from './components/menu/search';
import RoutingRequests from './functions/routing-requests';

import './app.scss';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <RoutingRequests />
                <Menu />
                <div className="menu-bkgd"></div>
                <div className="page">
                    <Switch>
                        <Route exact path={['/', '/events']} component={Home} />
                        <Route exact path="/resources" component={Resources} />
                        <Route exact path="/clubs" component={Clubs} />
                        <Route exact path="/add" component={Add} />
                        <Route exact path="/about" component={About} />
                        <Route exact path="/search" component={Search} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;