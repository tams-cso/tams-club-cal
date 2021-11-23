import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createTheme, StyledEngineProvider, adaptV4Theme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Cookies from 'universal-cookie';

import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';
import Popup from './components/shared/popup';
import Menu from './components/menu/menu';
import Home from './components/home/home';
import About from './components/about/about';
import Clubs from './components/clubs/clubs';
import NotFound from './components/404/404';
import Volunteering from './components/volunteering/volunteering';
import ReservationDisplay from './components/home/reservation/reservation-display';
// import Admin from './components/admin/admin';
import Auth from './components/edit/auth';
import Edit from './components/edit/edit';

const App = () => {
    const cookies = new Cookies();

    const [darkTheme, setDarkTheme] = useState(cookies.get('dark') === 'true');
    const theme = createTheme({
        palette: {
            mode: darkTheme ? 'dark' : 'light',
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
            h1: {
                fontSize: '2rem',
            },
            h2: {
                fontSize: '2.5rem',
                lineHeight: 1.167,
            },
            h3: {
                fontSize: '1.25rem',
                fontWeight: '500',
            },
            h4: {
                fontSize: '1.2rem',
                fontWeight: '500',
                color: darkTheme ? '#aaaaaa' : '#555555',
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
        cookies.set('dark', darkTheme, { sameSite: 'strict', path: '/' });
    }, [darkTheme]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Helmet>
                    <title>TAMS Club Calendar</title>
                </Helmet>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <BrowserRouter>
                        <Popup />
                        <Menu setDarkTheme={setDarkTheme} darkTheme={darkTheme} />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/events" component={Home} />
                            <Route exact path="/volunteering" component={Volunteering} />
                            <Route exact path="/clubs" component={Clubs} />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/auth" component={Auth} />
                            <Route exact path="/reservations" component={ReservationDisplay} />
                            {/* <Route exact path="/admin" component={Admin} /> */}
                            <Route path="/edit" component={Edit} />
                            <Route component={NotFound} />
                        </Switch>
                    </BrowserRouter>
                </LocalizationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
