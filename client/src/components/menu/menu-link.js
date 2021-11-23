import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch, isActive } from '../../functions/util';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '4rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        textDecoration: 'none',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: alpha(darkSwitch(theme, theme.palette.common.black, theme.palette.common.white), 0.1),
        },
        transition: '0.2s',
    },
    rootActive: {
        borderBottom: `0.2rem solid ${theme.palette.primary.light}`,
        backgroundColor: alpha('#ffffff', 0.3),
        '&:hover': {
            backgroundColor: alpha('#ffffff', 0.3),
        },
    },
    text: {
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        color: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[400]),
    },
    textActive: {
        color: darkSwitch(theme, theme.palette.common.white, theme.palette.primary.light),
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
            location.pathname === props.to ||
                location.pathname.slice(0, location.pathname.length - 1) === props.to ||
                props.isActive
        );
    }, [location]);

    return (
        <NavLink className={isActive(active, classes.root, classes.rootActive)} to={props.to} exact>
            <Box className={classes.textCenter}>
                <Typography variant="h5" className={isActive(active, classes.text, classes.textActive)}>
                    {props.children}
                </Typography>
            </Box>
        </NavLink>
    );
};

export default MenuLink;
