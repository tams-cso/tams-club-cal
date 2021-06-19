import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { makeStyles, fade } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: fade(theme.palette.type === 'light' ? '#000000' : '#ffffff', 0.1),
        },
        textDecoration: 'none',
        marginLeft: '1rem',
        marginRight: '1rem',
        borderRadius: '0.25rem',
        transition: '0.2s',
    },
    rootActive: {
        backgroundColor: fade('#ffffff', 0.3),
    },
    text: {
        color: theme.palette.type === 'light' ? 'white' : theme.palette.grey[400],
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
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
            <Typography variant="h6" className={classes.text}>
                {props.children}
            </Typography>
        </NavLink>
    );
};

export default MenuLink;
