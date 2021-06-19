import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles, fade } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: (props) => ({
        backgroundColor: props.active ? fade(theme.palette.common.white, 0.3) : 'transparent',
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.1),
        },
        textDecoration: 'none',
        marginLeft: '1rem',
        marginRight: '1rem',
        borderRadius: '0.25rem',
        transition: '0.2s'
    }),
    text: {
        color: 'white',
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
    },
}));

const MenuLink = (props) => {
    const active = window.location.pathname.indexOf(props.to) !== -1;
    const classes = useStyles({ active });

    return (
        <NavLink className={classes.root} to={props.to} exact>
            <Typography variant="h6" className={classes.text}>
                {props.children}
            </Typography>
        </NavLink>
    );
};

export default MenuLink;
