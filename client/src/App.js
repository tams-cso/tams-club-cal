import { BrowserRouter, Route } from 'react-router-dom';
import './App.scss';
import Menu from './components/Menu';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Clubs from './pages/Clubs';
import Add from './pages/Add';
import About from './pages/About';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Menu />
                <div className="menu-bkgd"></div>
                <div className="page">
                    <Route exact path={["/", "/event"]} component={Home} />
                    <Route exact path="/resources" component={Resources} />
                    <Route exact path="/clubs" component={Clubs} />
                    <Route exact path="/add" component={Add} />
                    <Route exact path="/about" component={About} />
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
