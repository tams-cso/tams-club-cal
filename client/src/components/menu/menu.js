import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
import Brightness2RoundedIcon from '@material-ui/icons/Brightness2Rounded';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import AppIcon from './app-icon';
import MenuLink from './menu-link';
import MenuIcon from './menu-icon';
import { githubLink } from '../../files/data.json';

const createStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.grey[900],
    },
    bar: {
        position: 'sticky',
        zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
        flexGrow: 1,
    },
    icon: {
        fill: theme.palette.type === 'light' ? 'white' : theme.palette.grey[400],
        fontSize: '2rem',
    },
    githubWrapper: {
        color: theme.palette.type === 'light' ? 'white' : theme.palette.grey[400],
        lineHeight: 0,
    },
    githubIcon: {
        fontSize: '2rem',
    },
    githubPath: {
        fill: theme.palette.type === 'light' ? 'white' : theme.palette.grey[400],
        fillRule: 'evenodd',
    },
}));

const Menu = (props) => {
    const classes = createStyles();
    const [currentDarkThemeIcon, setCurrentDarkThemeIcon] = useState(null);

    useEffect(() => {
        setCurrentDarkThemeIcon(
            props.darkTheme ? (
                <Brightness2RoundedIcon className={classes.icon}></Brightness2RoundedIcon>
            ) : (
                <WbSunnyRoundedIcon className={classes.icon}></WbSunnyRoundedIcon>
            )
        );
    }, [props]);

    const toggleDarkTheme = () => {
        props.setDarkTheme(!props.darkTheme);
    };

    return (
        <Appbar className={classes.bar}>
            <Toolbar className={classes.root}>
                <AppIcon className={classes.logo}></AppIcon>
                <MenuLink to="/">Home</MenuLink>
                <MenuLink to="/volunteering">Volunteering</MenuLink>
                <MenuLink to="/clubs">Clubs</MenuLink>
                <MenuLink to="/resources">Resources</MenuLink>
                <MenuLink to="/about">About</MenuLink>
                <MenuIcon
                    title={`Switch to ${props.darkTheme ? 'light' : 'dark'} theme`}
                    aria-label="toggle-theme"
                    onClick={toggleDarkTheme}
                >
                    {currentDarkThemeIcon}
                </MenuIcon>
                <MenuIcon title="GitHub repository" aria-label="github-repository">
                    <a href={githubLink} className={classes.githubWrapper}>
                        <SvgIcon viewBox="0 0 32.58 31.77" className={classes.githubIcon}>
                            <path
                                className={classes.githubPath}
                                d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"
                            />
                        </SvgIcon>
                    </a>
                </MenuIcon>
                <MenuIcon title="Your Profile" aria-label="your-profile">
                    <AccountCircleOutlinedIcon className={classes.icon}></AccountCircleOutlinedIcon>
                </MenuIcon>
            </Toolbar>
        </Appbar>
    );
};

export default Menu;
