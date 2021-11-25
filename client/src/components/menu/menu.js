import React, { useEffect, useState } from 'react';
import { darkSwitch } from '../../functions/util';

import Hidden from '@mui/material/Hidden';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2RoundedIcon from '@mui/icons-material/Brightness2Rounded';
import MobileMenu from './mobile-menu';
import DesktopMenu from './desktop-menu';

// Style the dark theme switcher icon
const iconStyle = {
    fill: (theme) => darkSwitch(theme, theme.palette.common.white, theme.palette.grey[400]),
    fontSize: '2rem',
};

/**
 * Displays the Appbar at the top of the screen
 * which serves as a navigation menu and theme switcher.
 *
 * @param {object} props React props object
 * @param {boolean} props.darkTheme True if the current theme is dark
 * @param {Function} props.setDarkTheme Sets the dark theme state variable
 */
const Menu = (props) => {
    const [currentDarkThemeIcon, setCurrentDarkThemeIcon] = useState(null);

    // Set the dark theme switcher icon based on the current theme
    // which will be passed in through the props
    useEffect(() => {
        setCurrentDarkThemeIcon(
            props.darkTheme ? (
                <Brightness2RoundedIcon sx={iconStyle}></Brightness2RoundedIcon>
            ) : (
                <WbSunnyRoundedIcon sx={iconStyle}></WbSunnyRoundedIcon>
            )
        );
    }, [props]);

    // Toggles the theme between dark and light
    const toggleDarkTheme = () => {
        props.setDarkTheme(!props.darkTheme);
    };

    return (
        <React.Fragment>
            <Hidden mdDown>
                <DesktopMenu
                    toggleDarkTheme={toggleDarkTheme}
                    currentDarkThemeIcon={currentDarkThemeIcon}
                    setCurrentDarkThemeIcon={setCurrentDarkThemeIcon}
                    darkTheme={props.darkTheme}
                />
            </Hidden>
            <Hidden mdUp>
                <MobileMenu
                    toggleDarkTheme={toggleDarkTheme}
                    currentDarkThemeIcon={currentDarkThemeIcon}
                    setCurrentDarkThemeIcon={setCurrentDarkThemeIcon}
                    darkTheme={props.darkTheme}
                />
            </Hidden>
        </React.Fragment>
    );
};

export default Menu;
