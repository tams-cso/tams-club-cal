import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles, fade } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '4rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: fade(theme.palette.type === 'light' ? '#000000' : '#ffffff', 0.1),
        },
        transition: '0.2s',
    },
    rootActive: {
        borderBottom: `0.2rem solid ${theme.palette.primary.light}`,
        backgroundColor: fade('#ffffff', 0.3),
        '&:hover': {
            backgroundColor: fade('#ffffff', 0.3),
        },
    },
    text: {
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        color: theme.palette.type === 'light' ? 'white' : theme.palette.grey[400],
    },
    textCenter: {
        height: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
}));

const MenuLink = (props) => {
    const [active, setActive] = useState(false);
    const classes = useStyles();

    let location = useLocation();
    useEffect(() => {
        setActive(
            location.pathname === props.to || location.pathname.slice(0, location.pathname.length - 1) === props.to
        );
    }, [location]);

    return (
        <NavLink className={`${classes.root} ${active ? classes.rootActive : ''}`} to={props.to} exact>
            <Box className={classes.textCenter}>
                <Typography variant="h6" className={classes.text}>
                    {props.children}
                </Typography>
            </Box>
        </NavLink>
    );
};

export default MenuLink;
