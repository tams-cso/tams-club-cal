import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const createStyles = makeStyles((theme) => ({
    root: {
        textDecoration: 'none',
    },
    svg: {
        fontSize: '3rem',
    },
    title: {
        marginLeft: '1rem',
        color: theme.palette.type === 'light' ? 'white' : theme.palette.primary.main,
    },
    a: {
        fill: '#7cc466',
        stroke: '#231f20',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    b: {
        fill: '#a2d395',
        stroke: '#231f20',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    c: {
        fill: '#c6e3be',
        stroke: '#231f20',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    d: {
        fill: '#fff',
    },
    e: {
        fill: '#fdc179',
    },
    f: {
        fill: 'none',
        strokeWidth: '1.5px',
        stroke: '#231f20',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
}));

function AppIcon(props) {
    const classes = createStyles();
    return (
        <NavLink className={`${props.className} ${classes.root}`} to="/">
            <Box display="flex" flexDirection="row" alignItems="center">
                <SvgIcon viewBox="0 0 39.53 29.56" titleAccess="app-icon" fontSize="large" className={classes.svg}>
                    <rect className={classes.a} x="3.14" y="0.5" width="25.92" height="25.92" />
                    <polygon className={classes.b} points="0.5 3.14 3.14 0.5 3.14 26.42 0.5 29.06 0.5 3.14" />
                    <polygon className={classes.c} points="26.42 29.06 29.06 26.42 3.14 26.42 0.5 29.06 26.42 29.06" />
                    <path className={classes.b} d="M29.08.5c0,12.52,10,21.89,10,21.89H13.11S3.15,13,3.15.5Z" />
                    <polygon
                        className={classes.d}
                        points="9.78 8.46 26.41 8.44 27.46 11.23 28.93 14.24 30.06 16.16 30.37 17.65 29.06 18.71 24.57 18.85 17.69 18.71 14.98 17.77 13.15 15.44 10.35 10.56 9.78 8.46"
                    />
                    <polygon
                        className={classes.e}
                        points="9.78 8.46 26.41 8.44 25.6 5.71 23.92 4.25 18.62 4.01 11.92 4.12 9.7 5.46 9.41 7.79 9.78 8.46"
                    />
                    <path
                        className={classes.f}
                        d="M29.37,15c.64,1.13,3.12,3.81-2.87,3.81H18.84c-3.65,0-4.15-1.35-5.39-3l0,0A25.58,25.58,0,0,1,9.59,8.46v0S7.89,4,13.24,4h7.4c3.16,0,4.9.58,5.37,2.79C26.53,9.86,28.73,13.91,29.37,15Z"
                    />
                    <line className={classes.f} x1="26.41" y1="8.44" x2="9.58" y2="8.44" />
                    <line className={classes.f} x1="12.16" y1="13.34" x2="28.44" y2="13.34" />
                    <path className={classes.f} d="M14.29,8.46c0,3.09,3.1,7.66,5.35,10.39" />
                    <path className={classes.f} d="M22.28,8.58c.78,4.28,5.31,10.2,5.31,10.2" />
                    <path className={classes.f} d="M18.38,8.46c0,3.09,2.89,7.51,5.13,10.25" />
                </SvgIcon>
                <Typography variant="h6" className={classes.title}>
                    TAMS Club Calendar
                </Typography>
            </Box>
        </NavLink>
    );
}

export default AppIcon;
