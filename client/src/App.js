import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Menu from './components/Menu';
import About from './pages/About';
import Add from './pages/Add';
import Clubs from './pages/Clubs';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Resources from './pages/Resources';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Menu />
                <div className="menu-bkgd"></div>
                <div className="page">
                    <Switch>
                        <Route exact path={["/", "/event"]} component={Home} />
                        <Route exact path="/resources" component={Resources} />
                        <Route exact path="/clubs" component={Clubs} />
                        <Route exact path="/add" component={Add} />
                        <Route exact path="/about" component={About} />
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
