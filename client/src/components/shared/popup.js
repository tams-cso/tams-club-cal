import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPopupMessage, getPopupOpen, getPopupSeverity } from '../../redux/selectors';
import { openPopup, setPopupOpen } from '../../redux/actions';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Cookies from 'universal-cookie';

const useStyles = makeStyles({
    root: {
        padding: 12,
    },
});

const Popup = () => {
    const open = useSelector(getPopupOpen);
    const message = useSelector(getPopupMessage);
    const severity = useSelector(getPopupSeverity);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleClose = () => {
        dispatch(setPopupOpen(false));
    };

    const calcSeverity = () => {
        const severityMap = {
            1: 'info',
            2: 'success',
            3: 'warning',
            4: 'error',
        };
        return severityMap[severity] || 'error';
    };

    useEffect(() => {
        const cookies = new Cookies();
        const success = cookies.get('success');
        cookies.remove('success');
        if (success) dispatch(openPopup(getSuccessMessage(success), 2));
    }, []);

    const getSuccessMessage = (success) => {
        const split = success.split('-');
        if (split.length !== 2) return success;
        return `Successfully ${split[0] === 'add' ? 'added' : 'updated'} ${split[1]}!`;
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            {severity !== 0 ? (
                <Alert severity={calcSeverity()}>{message}</Alert>
            ) : (
                <Card className={classes.root}>
                    <Typography>{message}</Typography>
                </Card>
            )}
        </Snackbar>
    );
};
export default Popup;
