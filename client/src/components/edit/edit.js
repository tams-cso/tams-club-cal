import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import EditLogin from './edit-login';
import EditEvents from './edit-events';
import EditClubs from './edit-clubs';
import EditVolunteering from './edit-volunteering';
import EditHistory from './edit-history';

class Edit extends React.Component {
    render() {
        return (
            <div className="edit">
                <BrowserRouter>
                    <EditLogin />
                    <EditHistory />
                    <Switch>
                        <Route path="/edit/events" component={EditEvents} />
                        <Route path="/edit/clubs" component={EditClubs} />
                        <Route path="/edit/volunteering" component={EditVolunteering} />
                        <Route>
                            <div className="edit-no-route center-text">ERROR: Invalid editing URL!</div>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default Edit;
