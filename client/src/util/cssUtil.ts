import { Theme } from '@mui/material';

// ================== CSS AND MUI FUNCTIONS =================== //
/**
 * Sets a style depending on whether or not the theme is light/dark
 *
 * @param theme The Mui theme object
 * @param lightStyle Light theme style
 * @param darkStyle Dark theme style
 * @returns Either the dark or light theme style, depending on the current mode
 */

export function darkSwitch(theme: Theme, lightStyle: string, darkStyle: string): string {
    return theme.palette.mode === 'light' ? lightStyle : darkStyle;
}
/**
 * Sets a grey (400/600) depending on whether or not the theme is light/dark
 *
 * @param theme The Mui theme object
 * @returns grey[600] for light theme and grey[400] for dark theme
 */

export function darkSwitchGrey(theme: Theme): string {
    return darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]);
}
