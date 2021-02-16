import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import EditLogin from './edit-login';
import EditEvents from './edit-events';
import EditClubs from './edit-clubs';
import EditVolunteering from './edit-volunteering';

import './edit.scss';

class Edit extends React.Component {
    render() {
        return (
            <div className="edit">
                <BrowserRouter>
                    <EditLogin />
                    <Switch>
                        <Route path="/edit/events">
                            <EditEvents parentHistory={this.props.history}></EditEvents>
                        </Route>
                        <Route path="/edit/clubs">
                            <EditClubs parentHistory={this.props.history}></EditClubs>
                        </Route>
                        <Route path="/edit/volunteering">
                            <EditVolunteering parentHistory={this.props.history}></EditVolunteering>
                        </Route>
                        <Route>
                            <div className="edit-no-route">ERROR: Invalid editing URL!</div>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default Edit;
