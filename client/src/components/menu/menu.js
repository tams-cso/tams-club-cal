import React from 'react';
import MenuLink from './menu-link';
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AppIcon from './app-icon';
import { makeStyles } from '@material-ui/core/styles';

const createStyles = makeStyles({
    root: {
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
    },
    logo: {
        flexGrow: 1,
    },
});

const Menu = () => {
    const classes = createStyles();

    return (
        <Appbar className="menu">
            <Toolbar className={classes.root}>
                <AppIcon className={classes.logo}></AppIcon>
                <MenuLink to="/">Home</MenuLink>
                <MenuLink to="/volunteering">Volunteering</MenuLink>
                <MenuLink to="/clubs">Clubs</MenuLink>
                <MenuLink to="/resources">Resources</MenuLink>
                <MenuLink to="/about">About</MenuLink>
            </Toolbar>
        </Appbar>
    );
};

export default Menu;
