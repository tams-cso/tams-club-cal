import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import theme from '../src/theme';
import darkTheme from '../src/darkTheme';

import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Menu from '../src/components/menu/menu';
import { getCookie, setCookie } from '../src/util/cookies';

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
        const prevDark = getCookie('dark');

        if (!prevDark) {
            // If it does not exist, use the system dark theme
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDark(systemDark);
            setCookie('dark', systemDark);
        } else {
            // Otherwise, use the previously set setting
            setDark(prevDark === 'true');
        }
    }, []);

    // Set dark theme on dark variable change
    useEffect(() => {
        setCookie('dark', dark);
    }, [dark]);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title>TAMS Club Calendar</title>
                <meta
                    key="description"
                    name="description"
                    content="The TAMS Club Calendar is a fully contained event tracker, club/volunteering database, and general resource center. This is the unofficial club event calendar for the Texas Academy of Mathematics and Science!"
                />
                <meta key="title" property="og:title" content="TAMS Club Calendar" />
                <meta key="type" property="og:type" content="website" />
                <meta key="url" property="og:url" content="https://tams.club/" />
                <meta key="image-0" property="og:image" content="https://cdn.tams.club/social-cover.webp" />
                <meta key="image-1" property="og:image:width" content="1200" />
                <meta key="image-2" property="og:image:height" content="630" />
                <meta key="site-name" property="og:site_name" content="TAMS Club Calendar" />
                <meta key="card" name="twitter:card" content="summary" />
                <meta key="title-1" name="twitter:title" content="TAMS Club Calendar" />
                <meta
                    key="description-1"
                    name="twitter:description"
                    content="The TAMS Club Calendar is a fully contained event tracker, club/volunteering database, and general resource center. This is the unofficial club event calendar for the Texas Academy of Mathematics and Science!"
                />
                <meta key="image-3" name="twitter:image" content="https://cdn.tams.club/social-cover.webp" />

                <meta key="theme-color" name="theme-color" content={theme.palette.primary.main} />
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
