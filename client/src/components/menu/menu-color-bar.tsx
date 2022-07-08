import React from 'react';
import Box from '@mui/material/Box';
import { darkSwitch } from '../../util/cssUtil';

/**
 * Displays a colored bar on top of the menu, for a color accent!
 */
const MenuColorBar = () => {
    return (
        <Box
            sx={{
                height: 8,
                width: '100%',
                background: (theme) =>
                    `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: (theme) => darkSwitch(theme, 'block', 'none'),
            }}
        />
    );
};

export default MenuColorBar;
