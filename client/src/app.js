import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';

import Menu from './components/menu/menu';
import About from './components/about/about';
import Clubs from './components/clubs/clubs';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Volunteering from './components/volunteering/volunteering';
import Edit from './components/edit/edit';
import Admin from './components/admin/admin';

import Resources from './components/resources/resources';
import Auth from './components/edit/auth';

const App = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const theme = createMuiTheme({
        palette: {
            type: darkTheme ? 'dark' : 'light',
            primary: {
                main: '#00c853',
                light: '#96ed98',
                dark: '#31893d',
            },
            secondary: {
                main: '#ffcc80',
                light: '#ffffb0',
                dark: '#ca9b52',
            },
        },
        typography: {
            h6: {
                fontFamily: ['Bubblegum Sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                fontSize: '1.5rem',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <BrowserRouter>
                    <Menu setDarkTheme={setDarkTheme} darkTheme={darkTheme} />
                    <div className="page">
                        <Switch>
                            <Route exact path={['/', '/events']} component={Home} />
                            <Route exact path="/volunteering" component={Volunteering} />
                            <Route exact path="/clubs" component={Clubs} />
                            <Route exact path="/resources" component={Resources} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/auth" component={Auth} />
                            <Route exact path="/admin" component={Admin} />
                            <Route path="/edit" component={Edit} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
};

export default App;
