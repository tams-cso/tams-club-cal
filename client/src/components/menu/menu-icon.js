import { ButtonBase, fade, makeStyles, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        padding: '0.5rem',
        borderRadius: '10rem',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: fade(theme.palette.type === 'light' ? '#000000' : '#ffffff', 0.1),
        },
        cursor: 'pointer',
        transition: '0.2s',
    },
}));

const MenuIcon = (props) => {
    const classes = useStyles();
    return (
        <Tooltip title={props.title} aria-label={props['aria-label']}>
            <ButtonBase onClick={props.onClick} className={classes.root} display="flex" alignItems="center">
                {props.children}
            </ButtonBase>
        </Tooltip>
    );
};

export default MenuIcon;
