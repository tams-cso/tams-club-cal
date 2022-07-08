import React, { useState, MouseEventHandler } from 'react';
import { darkSwitch } from '../../util/cssUtil';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';
import MenuHamburgerIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from '../shared/Link';
import MenuIcon from './menu-icon';
import AppIcon from './app-icon';
import HomeDrawerList from '../home/home-drawer-list';
import GithubIcon from './github-icon';
import MenuColorBar from './menu-color-bar';

import data from '../../data.json';

/** Props for the DesktopMenu component */
interface MobileMenuProps {
    /** Function that toggles the dark theme */
    toggleDarkTheme: MouseEventHandler<HTMLButtonElement>;

    /** Dark theme state variable */
    dark: boolean;

    /** Current icon for the dark theme switcher */
    currentDarkThemeIcon: typeof SvgIcon;
}

/**
 * Displays the menu for mobile (and small width) devices
 */
const MobileMenu = (props: MobileMenuProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    return (
        <React.Fragment>
            <AppBar
                sx={{
                    position: 'sticky',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
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
                    <IconButton aria-label="open mobile menu" onClick={toggleDrawer.bind(this, true)} size="large">
                        <MenuHamburgerIcon
                            sx={{
                                fill: (theme) => darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[400]),
                                marginRight: 2,
                            }}
                        />
                    </IconButton>
                    <AppIcon noText />
                    <Box sx={{ flexGrow: 1 }} />
                    <MenuIcon
                        title={`Switch to ${props.dark ? 'light' : 'dark'} theme`}
                        aria-label="toggle-theme"
                        onClick={props.toggleDarkTheme}
                    >
                        {props.currentDarkThemeIcon}
                    </MenuIcon>
                    <MenuIcon title="GitHub repository" aria-label="github-repository">
                        <MuiLink
                            href={data.githubLink}
                            target="_blank"
                            sx={{
                                lineHeight: 0,
                                color: (theme) =>
                                    darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
                            }}
                        >
                            <GithubIcon />
                        </MuiLink>
                    </MenuIcon>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer.bind(this, false)}>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        marginTop: 4,
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                    }}
                >
                    Navigation
                </Typography>
                <List sx={{ paddingRight: 4, paddingTop: 4 }}>
                    <ListItemButton component={Link} href="/" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <HomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/clubs" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <AppsRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clubs" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/volunteering" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <EmojiPeopleRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Volunteering" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/about" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <InfoRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/edit" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <CreateRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/profile/dashboard" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </List>
                <HomeDrawerList />
            </Drawer>
        </React.Fragment>
    );
};

export default MobileMenu;
