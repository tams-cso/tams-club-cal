import React, { useState } from 'react';
import { darkSwitch } from '../../functions/util';
import { Link } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SvgIcon from '@mui/material/SvgIcon';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuHamburgerIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import MenuIcon from './menu-icon';
import AppIcon from './app-icon';
import HomeDrawerList from '../home/home-drawer-list';
import GithubIcon from './github-icon';
import MenuColorBar from './menu-color-bar';

import { githubLink } from '../../data.json';

/**
 * Displays the menu for mobile (and small width) devices
 *
 * @param {object} props React props object
 * @param {Function} props.toggleDarkTheme Toggles dark theme
 * @param {boolean} props.darkTheme True if dark theme is enabled
 * @param {SvgIcon} props.currentDarkThemeIcon The current dark/light theme icon
 */
const MobileMenu = (props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => {
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
                            darkSwitch(theme, theme.palette.primary.main, theme.palette.grey[900]),
                    }}
                >
                    <IconButton aria-label="open mobile menu" onClick={toggleDrawer.bind(this, true)} size="large">
                        <MenuHamburgerIcon
                            sx={{
                                fill: (theme) => darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
                                marginRight: 2,
                            }}
                        />
                    </IconButton>
                    <AppIcon noText />
                    <Box sx={{ flexGrow: 1 }} />
                    <MenuIcon
                        title={`Switch to ${props.darkTheme ? 'light' : 'dark'} theme`}
                        aria-label="toggle-theme"
                        onClick={props.toggleDarkTheme}
                    >
                        {props.currentDarkThemeIcon}
                    </MenuIcon>
                    <MenuIcon title="GitHub repository" aria-label="github-repository">
                        <MuiLink
                            href={githubLink}
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
                        marginTop: '1rem',
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                    }}
                >
                    Navigation
                </Typography>
                <List sx={{ paddingRight: 4, paddingTop: 4 }}>
                    <ListItem button component={Link} to="/" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <HomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} to="/clubs" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <AppsRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clubs" />
                    </ListItem>
                    <ListItem button component={Link} to="/volunteering" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <EmojiPeopleRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Volunteering" />
                    </ListItem>
                    <ListItem button component={Link} to="/about" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <InfoRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                    <ListItem button component={Link} to="/edit" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon>
                            <CreateRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit" />
                    </ListItem>
                </List>
                <HomeDrawerList />
            </Drawer>
        </React.Fragment>
    );
};

export default MobileMenu;
