import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Cookies from 'universal-cookie';

import Menu from './components/menu/menu';
import About from './components/about/about';
import Clubs from './components/clubs/clubs';
import Home from './components/home/home';
import NotFound from './components/404/404';
import Volunteering from './components/volunteering/volunteering';
import Edit from './components/edit/edit';
import Admin from './components/admin/admin';
import Auth from './components/edit/auth';
import ErrorPage from './components/404/error-page';

const App = () => {
    const cookies = new Cookies();

    const [darkTheme, setDarkTheme] = useState(cookies.get('dark') === 'true');
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
            h3: {
                fontSize: '1.25rem',
                fontWeight: '500',
            },
            h4: {
                fontFamily: ['Roboto Mono', 'monospace'],
                fontSize: '1.25rem',
                fontWeight: '500',
                color: '#555555',
            },
            h5: {
                fontFamily: ['Bubblegum Sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                fontSize: '1.5rem',
            },
            h6: {
                fontWeight: '600',
            },
        },
    });

    useEffect(() => {
        cookies.set('dark', darkTheme, { sameSite: 'strict' });
    }, [darkTheme]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Menu setDarkTheme={setDarkTheme} darkTheme={darkTheme} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/volunteering" component={Volunteering} />
                    <Route exact path="/clubs" component={Clubs} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/auth" component={Auth} />
                    <Route exact path="/admin" component={Admin} />
                    <Route path="/edit" component={Edit} />
                    <Route exact path="/error" component={ErrorPage} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
