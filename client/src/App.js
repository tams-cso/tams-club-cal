import { BrowserRouter, Route } from 'react-router-dom';
import './App.scss';
import Menu from './components/Menu';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Menu />
                <Route exact path="/">
                </Route>
                <Route exact path="/resources">
                </Route>
                <Route exact path="/clubs">
                </Route>
                <Route exact path="/add">
                </Route>
                <Route exact path="/about">
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
