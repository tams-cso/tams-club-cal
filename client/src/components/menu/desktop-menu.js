import React from 'react';
import { useLocation } from 'react-router';
import { darkSwitch } from '../../functions/util';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AppIcon from './app-icon';
import MenuLink from './menu-link';
import MenuIcon from './menu-icon';
import GithubIcon from './github-icon';

import { githubLink } from '../../data.json';

/**
 * Displays the menu for desktop (and large width) devices
 * 
 * @param {object} props React props object
 * @param {Function} props.toggleDarkTheme Toggles dark theme
 * @param {boolean} props.darkTheme True if dark theme is enabled
 * @param {SvgIcon} props.currentDarkThemeIcon The current dark/light theme icon
 */
const DesktopMenu = (props) => {
    const location = useLocation();

    return (
        <React.Fragment>
            <AppBar
                sx={{
                    position: 'sticky',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar
                    sx={{
                        height: 64,
                        backgroundColor: (theme) =>
                            darkSwitch(theme, theme.palette.primary.main, theme.palette.grey[900]),
                    }}
                >
                    <AppIcon />
                    <Box sx={{ flexGrow: 1 }} />
                    <MenuLink to="/" isActive={() => ['/', '/events'].includes(location.pathname)}>
                        Home
                    </MenuLink>
                    <MenuLink to="/clubs">Clubs</MenuLink>
                    <MenuLink to="/volunteering">Volunteering</MenuLink>
                    <MenuLink to="/about">About</MenuLink>
                    <MenuLink to="/edit">Edit</MenuLink>
                    <MenuIcon
                        title={`Switch to ${props.darkTheme ? 'light' : 'dark'} theme`}
                        aria-label="toggle-theme"
                        onClick={props.toggleDarkTheme}
                    >
                        {props.currentDarkThemeIcon}
                    </MenuIcon>
                    <MenuIcon title="GitHub repository" aria-label="github-repository">
                        <Link
                            href={githubLink}
                            target="_blank"
                            sx={{
                                lineHeight: 0,
                                color: (theme) =>
                                    darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
                            }}
                        >
                            <GithubIcon />
                        </Link>
                    </MenuIcon>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default DesktopMenu;
