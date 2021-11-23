import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { darkSwitch } from '../../functions/util';

import ButtonBase from '@mui/material/ButtonBase';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        padding: '0.5rem',
        borderRadius: '10rem',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: alpha(darkSwitch(theme, theme.palette.common.black, theme.palette.common.white), 0.1),
        },
        cursor: 'pointer',
        transition: '0.2s',
    },
}));

const MenuIcon = (props) => {
    const classes = useStyles();
    return (
        <Tooltip title={props.title} aria-label={props['aria-label']}>
            <ButtonBase onClick={props.onClick} className={classes.root}>
                {props.children}
            </ButtonBase>
        </Tooltip>
    );
};

export default MenuIcon;
