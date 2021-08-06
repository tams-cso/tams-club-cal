import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Event } from '../../functions/entries';
import { getEvent, postEvent, putEvent } from '../../functions/api';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import DateTimeInput from './events/date-time-input';
import ControlledCheckbox from './events/controlled-checkbox';
import ControlledTextField from './shared/controlled-text-field';
import ControlledSelect from './shared/controlled-select';
import UploadBackdrop from './shared/upload-backdrop';
import Loading from '../shared/loading';
import TwoButtonBox from './shared/two-button-box';
import LocationSelect from './shared/location-select';
import DateInput from './events/date-input';
import AddButton from '../shared/add-button';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    form: {
        padding: 24,
        [theme.breakpoints.down('sm')]: {
            padding: 12,
        },
    },
    boxWrapper: {
        marginBottom: 16,
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    leftCheckbox: {
        [theme.breakpoints.up('md')]: {
            marginLeft: 8,
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 8,
        },
    },
    centerFlex: {
        justifyContent: 'center',
    },
    type: {
        height: 56,
    },
    spacer: {
        width: 20,
        [theme.breakpoints.down('sm')]: {
            height: 16,
        },
    },
}));

const EditEvents = () => {
    const [id, setId] = useState(null);
    const [event, setEvent] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [prevStart, setPrevStart] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm();
    const watchStart = watch('start');
    const watchEnd = watch('end');
    const watchNoEnd = watch('noEnd');
    const watchAllDay = watch('allDay');

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

    // Set "prevStart" variable to the starting time to use later
    useEffect(() => {
        if (!event) return;
        if (event.start) setPrevStart(event.start);
        else setPrevStart(dayjs().startOf('hour').add(1, 'hour').valueOf());
    }, [event]);

    // Offset the end time if startTime is changed to the same duration
    useEffect(() => {
        if (watchEnd === undefined || errors.end) return;
        const diff = watchEnd.valueOf() - prevStart;
        setValue('end', dayjs(watchStart.valueOf() + diff));
        setPrevStart(watchStart.valueOf());
    }, [watchStart]);

    // Set an error if the end time is set before the start time
    useEffect(() => {
        if (watchEnd === undefined || watchNoEnd) return;
        if (watchAllDay) {
            clearErrors('end');
            return;
        }
        if (watchEnd.isBefore(watchStart)) setError('end');
        else clearErrors('end');
    }, [watchStart, watchEnd, watchAllDay]);

    // Set the date of the "all day" date input to the same as the start time
    useEffect(() => {
        if (watchAllDay) setValue('date', watchStart);
    }, [watchAllDay]);

    const onSubmit = async (data) => {
        if (!('name' in data)) return;
        const cookies = new Cookies();

        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();
        const newEvent = new Event(
            id,
            event.eventId,
            event.reservationId,
            data.type,
            data.name,
            data.club,
            data.description,
            startTime,
            endTime,
            data.location,
            data.allDay,
            event.history
        );

        setBackdrop(true);
        const res = id === null ? await postEvent(newEvent) : await putEvent(newEvent, id);
        setBackdrop(false);
        if (res.status === 200) {
            cookies.set('success', id ? 'update-event' : 'add-event', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    const back = () => {
        redirect(`/events${id ? `?id=${id}` : ''}`);
    };

    return event === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Helmet>
                <title>{`${id ? 'Edit' : 'Add'} Event - TAMS Club Calendar`}</title>
            </Helmet>
            {id ? <AddButton editHistory path={`/edit/history/events?id=${id}`} /> : null}
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
                    <LocationSelect control={control} setValue={setValue} value={event.location} />
                </Box>
                <Box className={`${classes.boxWrapper} ${classes.centerFlex}`}>
                    {watchAllDay ? (
                        <DateInput control={control} name="date" label="Date" value={event.start} />
                    ) : (
                        <DateTimeInput
                            control={control}
                            name="start"
                            label={watchNoEnd ? 'Date/time' : 'Start date/time'}
                            value={event.start}
                            required
                        />
                    )}
                    <div className={classes.spacer} />
                    <DateTimeInput
                        name="end"
                        label="End date/time"
                        control={control}
                        value={event.end}
                        disabled={watchNoEnd || watchAllDay}
                        required
                        end
                    />
                    <ControlledCheckbox
                        control={control}
                        name="noEnd"
                        label="No end time"
                        value={false}
                        setValue={setValue}
                        className={classes.leftCheckbox}
                    />
                    <ControlledCheckbox
                        control={control}
                        name="allDay"
                        label="All day event"
                        value={event.allDay}
                        setValue={setValue}
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
                <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditEvents;
