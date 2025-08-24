import React, { useEffect, useState } from 'react';
import { useMediaQuery, type Theme } from '@mui/material';
import { darkSwitch } from '../../util/cssUtil';

import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2RoundedIcon from '@mui/icons-material/Brightness2Rounded';
import MobileMenu from './mobile-menu';
import DesktopMenu from './desktop-menu';
import theme from '../../theme';

// Style the dark theme switcher icon
const iconStyle = {
    fill: (theme: Theme) => darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[400]),
    fontSize: '2rem',
};

/** Props for the Menu component */
interface MenuProps {
    /** State variable where true means the current theme is dark */
    dark: boolean;

    /** State setter that sets the dark state variable */
    setDark: Function;
}

/**
 * Displays the Appbar at the top of the screen
 * which serves as a navigation menu and theme switcher.
 */
const Menu = (props: MenuProps) => {
    const [currentDarkThemeIcon, setCurrentDarkThemeIcon] = useState(null);
    const desktopSize = useMediaQuery(theme.breakpoints.up('md'));

    // Set the dark theme switcher icon based on the current theme
    // which will be passed in through the props
    useEffect(() => {
        setCurrentDarkThemeIcon(
            props.dark ? (
                <Brightness2RoundedIcon sx={iconStyle} width="16"></Brightness2RoundedIcon>
            ) : (
                <WbSunnyRoundedIcon sx={iconStyle} width="16"></WbSunnyRoundedIcon>
            )
        );
    }, [props]);

    // Toggles the theme between dark and light
    const toggleDarkTheme = () => {
        props.setDark(!props.dark);
    };

    return (
        <React.Fragment>
            {desktopSize ? (
                <DesktopMenu
                    toggleDarkTheme={toggleDarkTheme}
                    currentDarkThemeIcon={currentDarkThemeIcon}
                    dark={props.dark}
                />
            ) : (
                <MobileMenu
                    toggleDarkTheme={toggleDarkTheme}
                    currentDarkThemeIcon={currentDarkThemeIcon}
                    dark={props.dark}
                />
            )}
        </React.Fragment>
    );
};

export default Menu;
