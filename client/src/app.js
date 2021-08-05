import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createTheme, ThemeProvider } from '@material-ui/core';
import Cookies from 'universal-cookie';
import DayjsUtils from '@date-io/dayjs';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';
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
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta charset="utf-8" />
                <link rel="icon" href="%PUBLIC_URL%/favicon.ico?v=3" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#00c853" />
                <meta
                    name="description"
                    content="The TAMS Club Calendar is a fully contained event tracker, club/volunteering database, and general resource center. This is the unofficial club event calendar for the Texas Academy of Mathematics and Science!"
                />
                <meta property="og:title" content="TAMS Club Calendar" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://tams.club/" />
                <meta property="og:image" content="%PUBLIC_URL%/social-cover.webp" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <link rel="apple-touch-icon" href="%PUBLIC_URL%/android-chrome-192x192.png" />
                <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
                <title>TAMS Club Calendar</title>
            </Helmet>
            <CssBaseline />
            <MuiPickersUtilsProvider utils={DayjsUtils}>
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
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
};

export default App;
