import React, { useEffect, useState, MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import { removeCookie } from '../../util/cookies';
import { darkSwitch } from '../../util/cssUtil';
import type { Theme } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SvgIcon from '@mui/material/SvgIcon';
import AppIcon from './app-icon';
import MenuLink from './menu-link';
import MenuIcon from './menu-icon';
import GithubIcon from './github-icon';
import MenuColorBar from './menu-color-bar';

import data from '../../data.json';

/** Props for the DesktopMenu component */
interface DesktopMenuProps {
    /** Function that toggles the dark theme */
    toggleDarkTheme: MouseEventHandler<HTMLButtonElement>;

    /** Dark theme state variable */
    dark: boolean;

    /** Current icon for the dark theme switcher */
    currentDarkThemeIcon: typeof SvgIcon;
}

/**
 * Displays the menu for desktop (and large width) devices
 */
const DesktopMenu = (props: DesktopMenuProps) => {
    const router = useRouter();
    const [profileActive, setProfileActive] = useState(false);

    // If the location is /profile, set the profileActive state variable to true
    useEffect(() => {
        setProfileActive(router.pathname.includes('/profile'));
    }, [router.pathname]);

    // Route user to profile page
    const goToProfile = () => {
        // TODO: What do these 🍪s do?
        removeCookie('prev');
        router.push('/profile/dashboard');
    };

    return (
        <React.Fragment>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottom: (theme) => darkSwitch(theme, '1px solid #ddd', 'none'),
                    backgroundColor: (theme) => darkSwitch(theme, theme.palette.common.white, theme.palette.grey[900]),
                }}
            >
                <MenuColorBar />
                <Toolbar
                    sx={{
                        height: 64,
                        backgroundColor: (theme) =>
                            darkSwitch(theme, theme.palette.common.white, theme.palette.grey[900]),
                    }}
                >
                    <AppIcon />
                    <Box sx={{ flexGrow: 1 }} />
                    <MenuLink href="/" isActive={['/', '/events'].includes(location.pathname)}>
                        Home
                    </MenuLink>
                    <MenuLink href="/clubs">Clubs</MenuLink>
                    <MenuLink href="/volunteering">Volunteering</MenuLink>
                    <MenuLink href="/about">About</MenuLink>
                    <MenuLink href="/edit">Edit</MenuLink>
                    <MenuIcon title={`User Profile`} aria-label="user-profile" onClick={goToProfile}>
                        <AccountCircleIcon
                            sx={{
                                fill: (theme: Theme) =>
                                    profileActive
                                        ? darkSwitch(theme, theme.palette.primary.main, theme.palette.primary.light)
                                        : darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[400]),
                                fontSize: '2rem',
                            }}
                            width="16"
                        />
                    </MenuIcon>
                    <MenuIcon
                        title={`Switch to ${props.dark ? 'light' : 'dark'} theme`}
                        aria-label="toggle-theme"
                        onClick={props.toggleDarkTheme}
                    >
                        {props.currentDarkThemeIcon}
                    </MenuIcon>
                    <MenuIcon title="GitHub repository" aria-label="github-repository">
                        <Link
                            href={data.githubLink}
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
            <Toolbar />
        </React.Fragment>
    );
};

export default DesktopMenu;
