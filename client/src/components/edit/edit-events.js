import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { openPopup } from '../../redux/actions';
import { getParams, redirect } from '../../functions/util';
import { Event } from '../../functions/entries';
import { getEvent, getOverlappingReservations, postEvent, putEvent } from '../../functions/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
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
import Title from '../shared/title';
import FormWrapper from './shared/form-wrapper';
import Spacer from './shared/spacer';

/**
 * Main form for editing and adding events
 */
const EditEvents = () => {
    const [id, setId] = useState(null);
    const [event, setEvent] = useState(null);
    const [backdrop, setBackdrop] = useState(false);
    const [prevStart, setPrevStart] = useState(null);
    const dispatch = useDispatch();
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

    // When mounted, get the ID and fetch event data
    useEffect(async () => {
        // Extract ID from url search params
        const id = getParams('id');

        // If the ID is not null, fetch the event data from the backend and set the state variables
        // Otherwise, create a new event and load the default data into the controller
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

    // When the user submits the form, either create or update the event
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // Calculate the start and end times
        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();

        // Create or delete reservation if the state of the checkbox changes
        let resId = event.reservationId;

        // Start the upload process display because the reservation might take a bit to find
        setBackdrop(true);

        // Delete or create a reservation if the proper conditions are met
        if (event.reservationId === null && data.createReservation) {
            // Check to see if preconditions for creating a reservation are met
            if (data.location === 'none' || data.noEnd) {
                dispatch(
                    openPopup(
                        'Please select a valid location and time range for the reservation or remove the reservation.',
                        3
                    )
                );
                setBackdrop(false);
                return;
            }

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
            if (overlaps.data.length !== 0 && overlaps.data[0].id !== resId) {
                dispatch(openPopup('There is already a reservation during that time!', 3));
                setBackdrop(false);
                return;
            }
            resId = 1;
        } else if (event.reservationId !== null && !data.createReservation) {
            resId = -1;
        }

        // Create the event object from the data
        const newEvent = new Event(
            id,
            event.eventId,
            resId,
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

        // If the event ID is null, create the event, otherwise update it
        const res = id === null ? await postEvent(newEvent) : await putEvent(newEvent, id);

        // Finished uploading
        setBackdrop(false);

        // If the event was created successfully, redirect to the event page, otherwise display an error
        if (res.status === 200) {
            new Cookies().set('success', id ? 'update-event' : 'add-event', { sameSite: 'strict', path: '/' });
            back();
        } else dispatch(openPopup('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the event display page
    const back = () => {
        redirect(`/events${id ? `?id=${id}` : ''}`);
    };

    return event === null ? (
        <Loading flat />
    ) : (
        <React.Fragment>
            <Title title={`${id ? 'Edit' : 'Add'} Event`} />
            <UploadBackdrop open={backdrop} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Event' : 'Add Event'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/events?id=${id}`} /> : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <ControlledSelect
                        control={control}
                        setValue={setValue}
                        value={event.type}
                        name="type"
                        label="Type"
                        variant="outlined"
                        sx={{ height: 56 }}
                    >
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="signup">Signup/Deadline</MenuItem>
                    </ControlledSelect>
                    <Spacer />
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
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
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
                    <Spacer />
                    <LocationSelect
                        control={control}
                        setValue={setValue}
                        value={event.location}
                        sx={{ minWidth: 250 }}
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
                    <Spacer />
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
                        value={event.start ? event.start === event.end : false}
                        setValue={setValue}
                        sx={{ marginLeft: { lg: 2, xs: 0 }, marginTop: { lg: 0, xs: 2 } }}
                    />
                    <ControlledCheckbox
                        control={control}
                        name="allDay"
                        label="All day event"
                        value={event.allDay}
                        setValue={setValue}
                        sx={{ marginLeft: 0 }}
                    />
                    <ControlledCheckbox
                        control={control}
                        name="createReservation"
                        label="Create reservation"
                        value={event.reservationId !== null}
                        setValue={setValue}
                        sx={{ marginLeft: 0 }}
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
            </FormWrapper>
        </React.Fragment>
    );
};

export default EditEvents;
