import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPopupMessage, getPopupOpen, getPopupSeverity } from '../../redux/selectors';
import { openPopup, setPopupOpen } from '../../redux/actions';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
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
        const messageMap = {
            'add-event': 'Successfully added event!',
            'update-event': 'Successfully updated event!',
            'add-club': 'Successfully add club!',
            'update-club': 'Successfully updated club!',
            'add-volunteering': 'Successfully added volunteering!',
            'update-volunteering': 'Successfully updated volunteering!',
        };
        return messageMap[success] || '';
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
