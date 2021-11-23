import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { darkSwitchGrey, getParams, redirect } from '../../functions/util';
import { Reservation } from '../../functions/entries';
import { getRepeatingReservation, getReservation, postReservation, putReservation } from '../../functions/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DateTimeInput from './events/date-time-input';
import DateInput from './events/date-input';
import ControlledCheckbox from './events/controlled-checkbox';
import ControlledTextField from './shared/controlled-text-field';
import UploadBackdrop from './shared/upload-backdrop';
import Loading from '../shared/loading';
import TwoButtonBox from './shared/two-button-box';
import LocationSelect from './shared/location-select';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

dayjs.extend(isSameOrBefore);

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        fontSize: '3rem',
    },
    subtitle: {
        textAlign: 'center',
        color: darkSwitchGrey(theme),
    },
    form: {
        padding: 24,
        [theme.breakpoints.down('md')]: {
            padding: 12,
        },
    },
    boxWrapper: {
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    centerFlex: {
        justifyContent: 'center',
    },
    leftCheckbox: {
        [theme.breakpoints.up('md')]: {
            marginLeft: 8,
        },
        [theme.breakpoints.down('md')]: {
            marginTop: 8,
        },
    },
    rightCheckbox: {
        [theme.breakpoints.down('md')]: {
            marginBottom: 8,
        },
    },
    name: {
        flexGrow: 3,
    },
    spacer: {
        width: 20,
        [theme.breakpoints.down('md')]: {
            height: 16,
        },
    },
    area: {
        marginTop: 12,
    },
    fullMobile: {
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
    },
}));

const EditReservations = () => {
    const [id, setId] = useState(null);
    const [repeating, setRepeating] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [prevStart, setPrevStart] = useState(null);
    const [locationError, setLocationError] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        clearErrors,
        setError,
        formState: { errors },
    } = useForm();
    const watchStart = watch('start');
    const watchEnd = watch('end');
    const watchAllDay = watch('allDay');
    const watchLocation = watch('location');
    const watchRepeating = watch('repeating');
    const watchRepeatEnd = watch('repeatEnd');

    // Set "prevStart" variable to the starting time to use later
    useEffect(() => {
        if (!reservation) return;
        if (reservation.start) setPrevStart(reservation.start);
        else setPrevStart(dayjs().startOf('hour').add(1, 'hour').valueOf());
    }, [reservation]);

    // Offset the end time if startTime is changed to the same duration
    useEffect(() => {
        if (watchEnd === undefined || errors.end) return;
        const diff = watchEnd.valueOf() - prevStart;
        setValue('end', dayjs(watchStart.valueOf() + diff));
        setPrevStart(watchStart.valueOf());
    }, [watchStart]);

    // Set an error if the end time is set before the start time
    useEffect(() => {
        if (watchEnd === undefined) return;
        if (watchAllDay) {
            clearErrors('end');
            return;
        }
        if (watchEnd.isBefore(watchStart)) setError('end');
        else clearErrors('end');
    }, [watchStart, watchEnd, watchAllDay]);

    // Set an error if the repeat end time is set before the start time
    useEffect(() => {
        if (watchRepeatEnd === undefined) return;
        if (!watchRepeating) {
            clearErrors('repeatEnd');
            return;
        }
        if (watchRepeatEnd.startOf('hour').isSameOrBefore(watchStart)) setError('repeatEnd');
        else clearErrors('repeatEnd');
    }, [watchStart, watchRepeatEnd, watchRepeating]);

    // Set the date of the "all day" date input to the same as the start time
    useEffect(() => {
        if (watchAllDay) setValue('date', watchStart);
    }, [watchAllDay]);

    // Clear location error if not errored
    useEffect(() => {
        if (watchLocation !== 'none') setLocationError(false);
    }, [watchLocation]);

    useEffect(async () => {
        // Extract ID and repeating from url search params
        const id = getParams('id');
        const repeating = getParams('repeating');

        // Set the ID and reservation state variable
        if (id !== null) {
            const currReservation = repeating ? await getRepeatingReservation(id) : await getReservation(id);
            if (currReservation.status === 200) {
                setId(id);
                setRepeating(repeating);
                setReservation(currReservation.data);
            } else openPopup('Error fetching reservation info. Please refresh the page or add a new event.', 4);
        } else setReservation(new Reservation());
    }, []);

    const onSubmit = async (data) => {
        if (!('name' in data)) return;
        if (data.location === 'none') {
            setLocationError(true);
            return;
        }

        const cookies = new Cookies();
        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();

        const newReservation = new Reservation(
            reservation.id,
            reservation.eventId,
            data.name,
            data.club,
            data.description,
            startTime,
            endTime,
            data.location,
            data.allDay,
            data.repeating ? data.repeatEnd.valueOf() : null,
            reservation.history
        );

        setBackdrop(true);
        const res = id === null ? await postReservation(newReservation) : await putReservation(newReservation, id);
        if (res.status === 200) {
            cookies.set('success', id ? 'update-reservation' : 'add-reservation', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
        setBackdrop(false);
    };

    const back = () => {
        redirect(id ? `/reservations?id=${id}${repeating ? '&repeating=true' : ''}` : '/?view=reservation');
    };

    return reservation === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Reservation`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" className={classes.title}>
                {id ? 'Edit Reservation' : 'Add Reservation'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/reservations?id=${id}`} /> : null}
            <Typography className={classes.subtitle}>
                Start times will be rounded down and end times will be rounded up to the nearest hour.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Box className={classes.boxWrapper}>
                    <LocationSelect
                        control={control}
                        setValue={setValue}
                        value={reservation.location}
                        error={locationError}
                        hideHelper
                    />
                    <div className={classes.spacer} />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={reservation.name}
                        label="Reservation Name"
                        name="name"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a name"
                        className={`${classes.name} ${classes.fullMobile}`}
                    />
                    <div className={classes.spacer} />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={reservation.club}
                        label="Club"
                        name="club"
                        variant="outlined"
                        grow
                        required
                        errorMessage="Please enter a club name"
                        className={classes.fullMobile}
                    />
                </Box>
                <Box className={`${classes.boxWrapper} ${classes.centerFlex}`}>
                    {watchAllDay ? (
                        <DateInput control={control} name="date" label="Date" value={reservation.start} />
                    ) : (
                        <DateTimeInput
                            control={control}
                            name="start"
                            label="Start date/time"
                            value={reservation.start}
                            required
                        />
                    )}
                    <div className={classes.spacer} />
                    <DateTimeInput
                        name="end"
                        label="End date/time"
                        control={control}
                        value={reservation.end}
                        disabled={watchAllDay}
                        required
                        end
                    />
                    <ControlledCheckbox
                        control={control}
                        name="allDay"
                        label="All day reservation"
                        value={reservation.allDay}
                        setValue={setValue}
                        className={classes.leftCheckbox}
                    />
                </Box>
                <ControlledTextField
                    control={control}
                    setValue={setValue}
                    value={reservation.description}
                    label="Description (optional)"
                    name="description"
                    variant="outlined"
                    area
                />
                <Box className={classes.boxWrapper}>
                    <Typography>
                        Note: Repeating reservations cannot be changed to non-repeating reservations
                    </Typography>
                    <ControlledCheckbox
                        control={control}
                        name="repeating"
                        label="Repeats Weekly"
                        value={reservation.repeatEnd !== null && reservation.repeatEnd !== undefined}
                        disabled={reservation.repeatEnd !== null && reservation.repeatEnd !== undefined}
                        setValue={setValue}
                        className={`${classes.leftCheckbox} ${classes.rightCheckbox}`}
                    />
                    <DateInput
                        control={control}
                        name="repeatEnd"
                        label="Repeat Until"
                        value={reservation.repeatEnd}
                        disabled={!watchRepeating}
                    />
                </Box>
                <TwoButtonBox success="Submit" onCancel={back} onSuccess={onSubmit} submit right />
            </form>
        </React.Fragment>
    );
};

export default EditReservations;
