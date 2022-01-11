import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Cookies from 'universal-cookie';
import { openPopup } from '../../redux/actions';
import { darkSwitchGrey, getParams, redirect } from '../../functions/util';
import { Reservation } from '../../functions/entries';
import { getOverlappingReservations, getRepeatingReservation, getReservation, postReservation, putReservation } from '../../functions/api';

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
import FormWrapper from './shared/form-wrapper';
import Spacer from './shared/spacer';

// Use isSameOrBefore extension from dayjs
dayjs.extend(isSameOrBefore);

/**
 * Main form for editing and adding reservations
 */
const EditReservations = () => {
    const [id, setId] = useState(null);
    const [repeating, setRepeating] = useState(false);
    const [reservation, setReservation] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [prevStart, setPrevStart] = useState(null);
    const [locationError, setLocationError] = useState(false);
    const dispatch = useDispatch();
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

    // When mounted, get the ID and fetch reservation data
    useEffect(async () => {
        // Extract ID and repeating from url search params
        const id = getParams('id');
        const repeating = getParams('repeating');

        // If the ID is not null, fetch the reservation data from the backend and set the state variables
        // Otherwise, create a new reservation and load the default data into the controller
        if (id !== null) {
            // If the reservation is repeating, fetch the data from there instead of the regular reservations
            const currReservation = repeating ? await getRepeatingReservation(id) : await getReservation(id);
            if (currReservation.status === 200) {
                setId(id);
                setRepeating(repeating);
                setReservation(currReservation.data);
            } else openPopup('Error fetching reservation info. Please refresh the page or add a new event.', 4);
        } else setReservation(new Reservation());
    }, []);

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

    // When the user submits the form, either create or update the reservation
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // If the location of the reservation is "none", show an error and return
        if (data.location === 'none') {
            setLocationError(true);
            return;
        }

        // Calculate the start and end times
        // TODO: Check to see if the reservation overlaps a preexisting reservation
        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();

        // Start the upload process to account for overlap check latency
        setBackdrop(true);

        // Check to make sure that the reservation is not already taken
        const overlaps = await getOverlappingReservations(data.location, startTime, endTime);
        if (overlaps.status !== 200) {
            dispatch(
                openPopup(
                    'There was an error checking reservation time. Please check your connection and try again.',
                    4
                )
            );
            setBackdrop(false);
            return;
        }
        if (overlaps.data.length !== 0 && overlaps.data[0].id !== reservation.id) {
            console.log(overlaps.data);
            dispatch(openPopup('There is already a reservation during that time!', 3));
            setBackdrop(false);
            return;
        }

        // Create the reservation object from the data
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

        // If the reservation ID is null, create the event, otherwise update it
        const res = id === null ? await postReservation(newReservation) : await putReservation(newReservation, id);

        // Finished uploading
        setBackdrop(false);

        // If the upload was successful, redirect to the reservation page, otherwise show an error
        if (res.status === 200) {
            new Cookies().set('success', id ? 'update-reservation' : 'add-reservation', {
                sameSite: 'strict',
                path: '/',
            });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the reservation display page
    const back = () => {
        redirect(id ? `/reservations?id=${id}${repeating ? '&repeating=true' : ''}` : '/?view=reservation');
    };

    return reservation === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Reservation`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Reservation' : 'Add Reservation'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/reservations?id=${id}`} /> : null}
            <Typography sx={{ textAlign: 'center', color: (theme) => darkSwitchGrey(theme) }}>
                Start times will be rounded down and end times will be rounded up to the nearest hour.
            </Typography>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <LocationSelect
                        control={control}
                        setValue={setValue}
                        value={reservation.location}
                        error={locationError}
                    />
                    <Spacer />
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
                        sx={{ flexGrow: 3, width: { lg: 'unset', xs: '100%' } }}
                    />
                    <Spacer />
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
                        sx={{ width: { lg: 'unset', xs: '100%' } }}
                    />
                </Box>
                <Box
                    sx={{
                        marginBottom: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: { lg: 'row', xs: 'column' },
                    }}
                >
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
                    <Spacer />
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
                        sx={{ marginLeft: { lg: 2, xs: 0 }, marginTop: { lg: 0, xs: 2 } }}
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
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
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
                        sx={{
                            marginLeft: { lg: 2, xs: 0 },
                            marginBottom: { lg: 0, xs: 2 },
                            marginTop: { lg: 0, xs: 2 },
                        }}
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
            </FormWrapper>
        </React.Fragment>
    );
};

export default EditReservations;
