import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import Cookies from 'universal-cookie';
import theme from '../src/theme';
import darkTheme from '../src/darkTheme';

import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Menu from '../src/components/menu/menu';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const [dark, setDark] = useState(false);

    // Set the dark theme on load
    // Both the dark state variable and setDark state function will
    // be passed into the component props
    useEffect(() => {
        // Get the previously saved dark theme choice from cookies
        const cookies = new Cookies();
        const prevDark = cookies.get('dark');

        if (!prevDark) {
            // If it does not exist, use the system dark theme
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDark(systemDark);
            cookies.set('dark', systemDark, { sameSite: 'strict', path: '/' });
        } else {
            // Otherwise, use the previously set setting
            setDark(prevDark === 'true');
        }
    }, []);

    useEffect(() => {
        const cookies = new Cookies();
        cookies.set('dark', dark, { sameSite: 'strict', path: '/' });
    }, [dark]);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>TAMS Club Calendar</title>
            </Head>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={dark ? darkTheme : theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CssBaseline />
                        <Menu dark={dark} setDark={setDark} />
                        <Component {...pageProps} />
                    </LocalizationProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </CacheProvider>
    );
}
