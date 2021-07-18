import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { dateToMillis, getParams, redirect } from '../../functions/util';
import { Event } from '../../functions/entries';
import { getEvent, postEvent } from '../../functions/api';

import { Controller } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DateTimeInput from './util/date-time-input';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ControlledTextField from './util/controlled-text-field';
import ControlledSelect from './util/controlled-select';
import UploadBackdrop from '../shared/upload-backdrop';
import Loading from '../shared/loading';

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
    submit: {
        margin: 'auto',
        display: 'block',
    },
}));

const EditEvents = () => {
    const [id, setId] = useState(null);
    const [event, setEvent] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        watch,
        control,
    } = useForm();
    const watchStart = watch('start');
    const watchEnd = watch('end');
    const watchNoEnd = watch('noEnd');

    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID and event state variable
        if (id !== null) {
            const currEvent = await getEvent(id);
            if (currEvent.status === 200) {
                setId(id);
                setEvent(currEvent.data);
            } else openPopup('Error fetching event info. Please refresh the page or add a new event.', 4);
        } else setEvent(new Event());
    }, []);

    useEffect(() => {
        // TODO: Keep interval the same when changing start time
        if (watchEnd === undefined || watchNoEnd) return;
        if (watchEnd.isBefore(watchStart)) setError('end');
        else clearErrors('end');
    }, [watchStart, watchEnd]);

    const onSubmit = async (data) => {
        const cookies = new Cookies();
        const startTime = dateToMillis(data.start);
        const endTime = data.noEnd ? startTime : dateToMillis(data.end);
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

    return event === null ? (
        <Loading />
    ) : (
        <React.Fragment>
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Event' : 'Add Event'}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
                    <ControlledSelect
                        control={control}
                        setValue={setValue}
                        value={event.type}
                        name="type"
                        variant="outlined"
                        className={classes.type}
                    >
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="signup">Signup/Deadline</MenuItem>
                    </ControlledSelect>
                    <div className={classes.spacer} />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={event.name}
                        label="Event Name"
                        name="name"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a name"
                    />
                </Box>
                <Box className={classes.boxWrapper}>
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={event.club}
                        label="Club"
                        name="club"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a club name"
                    />
                    <div className={classes.spacer} />
                    <DateTimeInput
                        name="start"
                        label={watchNoEnd ? 'Date/time' : 'Start date/time'}
                        control={control}
                        required={true}
                    />
                    {watchNoEnd ? null : (
                        <React.Fragment>
                            <div className={classes.spacer} />
                            <DateTimeInput name="end" label="End date/time" control={control} required={true} end />
                        </React.Fragment>
                    )}
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
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={event.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    area
                />
                <Button type="submit" variant="outlined" color="primary" className={classes.submit}>
                    Submit
                </Button>
            </form>
        </React.Fragment>
    );
};

export default EditEvents;
