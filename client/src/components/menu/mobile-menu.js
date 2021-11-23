import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch } from '../../functions/util';
import { githubLink } from '../../data.json';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SvgIcon from '@mui/material/SvgIcon';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
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
import { Link } from 'react-router-dom';
import HomeDrawerList from '../home/home-drawer-list';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: darkSwitch(theme, theme.palette.primary.main, theme.palette.grey[900]),
        width: '100%',
    },
    bar: {
        position: 'sticky',
        zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
        marginLeft: 16,
        padding: '8px 0',
        flexGrow: 1,
    },
    list: {
        paddingRight: 16,
    },
    githubWrapper: {
        color: darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
        lineHeight: 0,
    },
    githubIcon: {
        fontSize: '2rem',
    },
    githubPath: {
        fill: darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
        fillRule: 'evenodd',
    },
    hamburger: {
        fill: darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
    },
    title: {
        textAlign: 'center',
        marginTop: '1rem',
    },
}));

/**
 * Displays the menu for mobile (and small width) devices
 * @param {object} props React props object
 * @param {Function} props.toggleDarkTheme Toggles dark theme
 * @param {boolean} props.darkTheme True if dark theme is enabled
 * @param {SvgIcon} props.currentDarkThemeIcon The current dark/light theme icon
 * @param {Function} props.setCurrentDarkThemeIcon Set the aforementioned icon
 */
const MobileMenu = (props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const classes = useStyles();

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    return (
        <React.Fragment>
            <AppBar className={classes.bar}>
                <Toolbar className={classes.root}>
                    <IconButton
                        aria-label="open mobile menu"
                        onClick={toggleDrawer.bind(this, true)}
                        size="large">
                        <MenuHamburgerIcon className={classes.hamburger} />
                    </IconButton>
                    <AppIcon className={classes.logo} noText></AppIcon>
                    <MenuIcon
                        title={`Switch to ${props.darkTheme ? 'light' : 'dark'} theme`}
                        aria-label="toggle-theme"
                        onClick={props.toggleDarkTheme}
                    >
                        {props.currentDarkThemeIcon}
                    </MenuIcon>
                    <MenuIcon title="GitHub repository" aria-label="github-repository">
                        <a href={githubLink} className={classes.githubWrapper} target="_blank">
                            <SvgIcon viewBox="0 0 32.58 31.77" className={classes.githubIcon}>
                                <path
                                    className={classes.githubPath}
                                    d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"
                                />
                            </SvgIcon>
                        </a>
                    </MenuIcon>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer.bind(this, false)}>
                <Typography variant="h3" className={classes.title}>
                    Navigation
                </Typography>
                <List className={classes.list}>
                    <ListItem button component={Link} to="/" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon className={classes.listIcon}>
                            <HomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} to="/clubs" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon className={classes.listIcon}>
                            <AppsRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clubs" />
                    </ListItem>
                    <ListItem button component={Link} to="/volunteering" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon className={classes.listIcon}>
                            <EmojiPeopleRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Volunteering" />
                    </ListItem>
                    <ListItem button component={Link} to="/about" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon className={classes.listIcon}>
                            <InfoRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                    <ListItem button component={Link} to="/edit" onClick={toggleDrawer.bind(this, false)}>
                        <ListItemIcon className={classes.listIcon}>
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
