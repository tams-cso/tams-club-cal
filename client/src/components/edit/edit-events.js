import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { openPopup } from '../../redux/actions';
import { dateToMillis, getParams, redirect } from '../../functions/util';
import { Event } from '../../functions/entries';

import { postEvent } from '../../functions/api';
import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateTimeInput from './date-time-input';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    form: {
        padding: 24,
    },
    boxWrapper: {
        marginBottom: 16,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    type: {
        height: 56,
    },
    check: {
        alignSelf: 'flex-start',
        [theme.breakpoints.up('md')]: {
            marginLeft: 8,
            marginTop: 6,
        },
    },
    spacer: {
        width: 20,
        [theme.breakpoints.down('sm')]: {
            height: 16,
        },
    },
    grow: {
        flexGrow: 1,
    },
    area: {
        width: '100%',
        marginBottom: 16,
    },
    submit: {
        margin: 'auto',
        display: 'block',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    uploading: {
        marginRight: 12,
    },
}));

const EditEvents = () => {
    const [id, setId] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        control,
        formState: { errors },
    } = useForm();
    const watchStart = watch('start');
    const watchEnd = watch('end');
    const watchType = watch('type');

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID state variable
        if (id !== null) setId(id);
    }, []);

    useEffect(() => {
        if (watchEnd === undefined) return;
        if (watchEnd.isBefore(watchStart)) setError('end');
        else clearErrors('end');
    }, [watchStart, watchEnd]);

    const onSubmit = async (data) => {
        const cookies = new Cookies();
        const startTime = dateToMillis(data.start);
        const endTime = dateToMillis(data.end);
        if (id === null) {
            const newEvent = new Event(
                null,
                null,
                data.type || 'event',
                data.name,
                data.club,
                data.description || '',
                startTime,
                endTime
            );

            setBackdrop(true);
            const res = await postEvent(newEvent);
            setBackdrop(false);

            if (res.status === 200) {
                redirect('/');
                cookies.set('success', 'add-event', { sameSite: 'strict', path: '/' });
            } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        }
    };

    return (
        <React.Fragment>
            <Backdrop open={backdrop} className={classes.backdrop}>
                <Typography variant="h1" className={classes.uploading}>
                    Uploading event...
                </Typography>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h1" className={classes.title}>
                Edit Event
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
                    <Select
                        {...register('type')}
                        id="select-event-type"
                        defaultValue="event"
                        variant="outlined"
                        className={classes.type}
                    >
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="signup">Signup/Deadline</MenuItem>
                    </Select>
                    <div className={classes.spacer} />
                    <TextField
                        {...register('name', { required: true })}
                        label="Event Name"
                        variant="outlined"
                        defaultValue=""
                        error={errors.name !== undefined}
                        helperText={errors.name ? 'Please enter a name' : null}
                        className={classes.grow}
                    />
                </Box>
                <Box className={classes.boxWrapper}>
                    <TextField
                        {...register('club', { required: true })}
                        label="Club"
                        variant="outlined"
                        defaultValue=""
                        error={errors.club !== undefined}
                        helperText={errors.club ? 'Please enter a name' : null}
                        className={classes.grow}
                    />
                    <div className={classes.spacer} />
                    <DateTimeInput
                        name="start"
                        label={watchType === 'signup' ? 'Date/time' : 'Start date/time'}
                        control={control}
                        required={true}
                    />
                    <div className={classes.spacer} />
                    <DateTimeInput name="end" label="End date/time" control={control} required={true} />
                    <Controller
                        control={control}
                        name="noEnd"
                        defaultValue={false}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormControlLabel
                                control={<Checkbox />}
                                label="No end time"
                                className={classes.check}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                </Box>
                <TextField
                    {...register('description', { required: false })}
                    label="Description (optional)"
                    variant="outlined"
                    multiline
                    rows={4}
                    defaultValue=""
                    className={classes.area}
                />
                <Button type="submit" variant="outlined" color="primary" className={classes.submit}>
                    Submit
                </Button>
            </form>
        </React.Fragment>
    );
};

export default EditEvents;
