import React, { PropsWithChildren, MouseEventHandler } from 'react';
import { alpha } from '@mui/material/styles';
import { darkSwitch } from '../../util/cssUtil';

import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';

interface MenuIconProps {
    /** Tooltip title */
    title: string;

    /** Function to call when clicked */
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Icon wrapper for the menu that displays a custom tooltip
 * and highlighted styles when hovered over.
 */
const MenuIcon = (props: PropsWithChildren<MenuIconProps>) => {
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
