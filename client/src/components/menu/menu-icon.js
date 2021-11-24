import React from 'react';
import { alpha } from '@mui/material/styles';
import { darkSwitch } from '../../functions/util';

import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';

/**
 * Icon wrapper for the menu that displays a custom tooltip
 * and highlighted styles when hovered over.
 * 
 * @param {object} props React props object
 * @param {string} props.title Tooltip title
 * @param {Function} props.onClick Function to call when clicked
 * @param {*} props.children Contents of the MenuIcon
 */
const MenuIcon = (props) => {
    return (
        <Tooltip title={props.title} aria-label={props['aria-label']}>
            <ButtonBase
                onClick={props.onClick}
                sx={{
                    marginLeft: '0.5rem',
                    marginRight: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '10rem',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': {
                        backgroundColor: (theme) =>
                            alpha(darkSwitch(theme, theme.palette.common.black, theme.palette.common.white), 0.1),
                    },
                }}
            >
                {props.children}
            </ButtonBase>
        </Tooltip>
    );
};

export default MenuIcon;
