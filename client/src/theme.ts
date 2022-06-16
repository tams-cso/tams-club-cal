import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: 'light',
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
        background: {
            default: '#fafffa',
            paper: '#ffffff',
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
            color: '#555555',
        },
        h5: {
            fontFamily: ['Bubblegum Sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: '600',
        },
    },
});

export default theme;
