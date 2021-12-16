import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { darkSwitch } from '../../functions/util';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavLink from '../shared/navlink';

/**
 * A link in the navbar that is styled to highlight when hovered over
 * and displays a different style when active.
 * This component will also automatically set the "active" state
 * of the link based on the current path.
 *
 * @param {object} props React props object
 * @param {string} props.to The path to navigate to
 * @param {boolean} props.isActive True if the link is manually set to active
 * @param {*} props.children The content of the link
 */
const MenuLink = (props) => {
    const [active, setActive] = useState(false);
    const location = useLocation();

    // Set the active state of the link based on the current path
    // If the path does not match, check if props.isActive is true and use that instead
    // This is used when there are multiple paths to match and a custom function can be passed in
    useEffect(() => {
        setActive(
            location.pathname === props.to ||
                location.pathname.slice(0, location.pathname.length - 1) === props.to ||
                props.isActive
        );
    }, [location]);

    return (
        <NavLink
            to={props.to}
            exact
            sx={{
                height: '4rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                textDecoration: 'none',
                borderColor: 'transparent',
                borderBottom: (theme) =>
                    darkSwitch(theme, 'none', !active ? '0.2rem' : `0.2rem solid ${theme.palette.primary.light}`),
                backgroundColor: (theme) => (active ? alpha(theme.palette.common.white, 0.1) : 'transparent'),
                transition: '0.2s',
                color: (theme) =>
                    !active
                        ? darkSwitch(theme, theme.palette.grey[800], theme.palette.grey[400])
                        : darkSwitch(theme, theme.palette.primary.main, theme.palette.primary.light),
                '&:hover': {
                    color: (theme) => darkSwitch(theme, theme.palette.primary.main, theme.palette.primary.light),
                    backgroundColor: (theme) =>
                        darkSwitch(theme, 'transparent', alpha(theme.palette.common.white, 0.1)),
                },
            }}
        >
            <Box
                sx={{
                    height: '4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        marginLeft: '0.5rem',
                        marginRight: '0.5rem',
                    }}
                >
                    {props.children}
                </Typography>
            </Box>
        </NavLink>
    );
};

export default MenuLink;
