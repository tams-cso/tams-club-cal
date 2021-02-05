import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Menu from './pages/Menu';
import About from './pages/About';
import Add from './pages/Add';
import Clubs from './pages/Clubs';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Resources from './pages/Resources';
import Search from './pages/Search';

import { getSavedClubList, getSavedEventList, getSavedVolunteeringList } from './redux/selectors';
import { setEventList, setPopupOpen, setPopupId } from './redux/actions';

import './App.scss';

class App extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="App">
                <BrowserRouter>
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
}

const mapStateToProps = (state) => {
    return {
        eventList: getSavedEventList(state),
        volunteerList: getSavedVolunteeringList(state),
        clubList: getSavedClubList(state),
    };
};
const mapDispatchToProps = { setEventList, setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
