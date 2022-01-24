import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs, { Dayjs } from 'dayjs';
import { createPopupEvent, createEvent } from '../../../src/util';
import { PopupEvent, RepeatingStatus } from '../../../src/types';
import { getEvent, getOverlappingReservations, postEvent, putEvent } from '../../../src/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import DateTimeInput from '../../../src/components/edit/events/date-time-input';
import ControlledCheckbox from '../../../src/components/edit/events/controlled-checkbox';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import ControlledSelect from '../../../src/components/edit/shared/controlled-select';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import LocationSelect from '../../../src/components/edit/events/location-select';
import DateInput from '../../../src/components/edit/events/date-input';
import AddButton from '../../../src/components/shared/add-button';
import Title from '../../../src/components/shared/title';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';
import Link from '../../../src/components/shared/Link';

import data from '../../../src/data.json';

type SubmitData = {
    type: string;
    name: string;
    club: string;
    location: string;
    otherLocation: string;
    start: Dayjs;
    end: Dayjs;
    date: Dayjs;
    noEnd: boolean;
    allDay: boolean;
    description: string;
    publicEvent: boolean;
    reservation: boolean;
    repeatsWeekly: boolean;
    repeatsMonthly: boolean;
    repeatsUntil: number;
};

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const id = ctx.params.id as string;
    if (!id) return { props: { event: createEvent(), id: null, error: false } };
    const eventRes = await getEvent(id);
    const error = eventRes.status !== 200;
    const event = error ? createEvent() : eventRes.data;
    return {
        props: { event, error, id: error ? null : id },
    };
};

/**
 * Main form for editing and adding events
 */
const EditEvents = ({ event, id, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const [backdrop, setBackdrop] = useState(false);
    const [prevStart, setPrevStart] = useState(null);
    const [popupEvent, setPopupEvent] = useState<PopupEvent>();
    const [displayError, setDisplayError] = useState(false);
    const {
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm();
    const watchStart: Dayjs = watch('start');
    const watchEnd: Dayjs = watch('end');
    const watchNoEnd: boolean = watch('noEnd');
    const watchAllDay: boolean = watch('allDay');
    const watchLocation: string = watch('location');
    const watchOtherLocation: string = watch('otherLocation');
    const watchPublicEvent: boolean = watch('publicEvent');
    const watchReservation: boolean = watch('reservation');
    const watchRepeatsWeekly: boolean = watch('repeatsWeekly');
    const watchRepeatsMonthly: boolean = watch('repeatsMonthly');
    const watchRepeatsUntil: Dayjs = watch('repeatsUntil');

    // When the user submits the form, either create or update the event
    const onSubmit = async (data: SubmitData) => {
        // Calculate the start and end times
        // For the start time, use the "date" input field to calculate if all day
        // For the end time, if allDay or noEnd, simply set to the same as the start time
        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();

        // Check to make sure repeating data is valid and set the variables if true
        let repeats = event.repeats;
        if (data.repeatsWeekly || data.repeatsMonthly) {
            // Make sure there is actually an end time
            if (data.noEnd) {
                setPopupEvent(createPopupEvent('Repeating events cannot have no end time set', 3));
                return;
            }

            // Set the status based on the event name
            // and calculate the number of times each event repeats
            let repeatCount = 0;
            if (data.repeatsWeekly) {
                repeats = RepeatingStatus.WEEKLY;
                repeatCount = dayjs(data.start).diff(data.repeatsUntil, 'week');
            } else {
                repeats = RepeatingStatus.MONTHLY;
                repeatCount = dayjs(data.start).diff(data.repeatsUntil, 'month');
            }

            // Make sure that the number of repeating events is not abhorently long (>100)
            if (Math.abs(repeatCount) > 100) {
                setPopupEvent(
                    createPopupEvent(
                        'Events cannot repeat more than 100 times! Please check the repeats until date or create multiple repeating events.',
                        3
                    )
                );
                return;
            }
        }

        // Start the upload process display because the reservation might take a bit to find
        setBackdrop(true);

        // Check for the conditions for creating a reservation
        if (data.reservation) {
            // If location is "none"/"other" or if there is no end time, return error
            if (data.location === 'none' || data.location === 'other' || data.noEnd) {
                setPopupEvent(
                    createPopupEvent(
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
                setPopupEvent(
                    createPopupEvent(
                        'There was an error checking reservation time. Please check your connection and try again.',
                        4
                    )
                );
                setBackdrop(false);
                return;
            }
            if (overlaps.data.length !== 0 && overlaps.data[0].id !== id) {
                // TODO: Log error to admins if the overlaps length is > 1
                setPopupEvent(createPopupEvent('There is already a reservation during that time!', 3));
                setBackdrop(false);
                return;
            }
        }

        // Create the event object from the data
        const newEvent = createEvent(
            id,
            event.eventId,
            data.type,
            data.name,
            data.club,
            data.description,
            startTime,
            endTime,
            data.location === 'other' ? data.otherLocation : data.location,
            data.noEnd,
            data.allDay,
            repeats,
            data.repeatsUntil.valueOf(),
            event.repeatOriginId,
            data.publicEvent,
            data.reservation,
            event.history
        );

        // If the event ID is null, create the event, otherwise update it
        const res = id === null ? await postEvent(newEvent) : await putEvent(newEvent, id);

        // Finished uploading
        setBackdrop(false);

        // If the event was created successfully, redirect to the event page, otherwise display an error
        if (res.status === 204) {
            new Cookies().set('success', id ? 'update-event' : 'add-event', { sameSite: 'strict', path: '/' });
            back();
        } else setPopupEvent(createPopupEvent('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the event display page
    const back = () => {
        router.push(`/events${id ? `/${id}` : ''}`);
    };

    // On load
    useEffect(() => {
        // Send error if can't fetch resource
        if (error) {
            setPopupEvent(
                createPopupEvent('Error fetching event info. Please refresh the page or add a new event.', 4)
            );
        }

        // Set "prevStart" variable to the starting time to use later
        if (event.start) setPrevStart(event.start);
        else setPrevStart(dayjs().startOf('hour').add(1, 'hour').valueOf());
    }, []);

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
        if (watchAllDay || watchNoEnd) {
            clearErrors('end');
            return;
        }
        if (watchEnd.isBefore(watchStart)) setError('end', { message: 'End is before start' });
        else clearErrors('end');
    }, [watchStart, watchEnd, watchAllDay, watchNoEnd]);

    // Set the date of the "all day" date input to the same as the start time
    useEffect(() => {
        if (watchAllDay) setValue('date', watchStart);
    }, [watchAllDay]);

    // Check to see if the other location is empty and clear errors if the location is changed
    useEffect(() => {
        if (watchLocation !== 'other') {
            clearErrors('otherLocation');
        }
    }, [watchLocation]);

    // Set display error if neither public or reservation is selected
    useEffect(() => {
        setDisplayError(!watchPublicEvent && !watchReservation);
    }, [watchPublicEvent, watchReservation]);

    // If the location is a custom one, replace with "other" in form
    const defaultLocation = id
        ? data.rooms.findIndex((r) => r.value === event.location) === -1
            ? 'other'
            : event.location
        : 'none';

    return (
        <EditWrapper>
            <Title title={`${id ? 'Edit' : 'Add'} Event`} />
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id ? 'Edit Event' : 'Add Event'}
            </Typography>
            {id ? <AddButton editHistory path={`/edit/history/events/${id}`} /> : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={event.type}
                        label="Event Type"
                        name="type"
                        variant="outlined"
                        required
                        errorMessage="Please enter a type"
                    />
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
                        value={defaultLocation}
                        sx={{ minWidth: 250 }}
                    />
                    {watchLocation === 'other' ? (
                        <React.Fragment>
                            <Spacer />
                            <ControlledTextField
                                control={control}
                                setValue={setValue}
                                value={defaultLocation === 'other' ? event.location : ''}
                                label="Custom Location"
                                name="otherLocation"
                                variant="outlined"
                                errorMessage="Please enter a custom location"
                                validate={() =>
                                    watchLocation !== 'other' ||
                                    (watchOtherLocation && watchOtherLocation.trim() !== '')
                                }
                            />
                        </React.Fragment>
                    ) : null}
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
                        errorMessage="End time cannot be before start time"
                        validate={() => watchStart.isBefore(watchEnd)}
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
                <ControlledCheckbox
                    control={control}
                    name="publicEvent"
                    label="Show on public calendar (Will show this event on the schedule view and create a calendar event)"
                    value={event.publicEvent}
                    setValue={setValue}
                    sx={{ display: 'block' }}
                />
                <ControlledCheckbox
                    control={control}
                    name="reservation"
                    label="Create room reservation (Will show on reservation calendar; must select non-custom location and valid times)"
                    value={event.reservation}
                    setValue={setValue}
                    sx={{ display: 'block' }}
                />
                {displayError ? (
                    <Typography sx={{ color: (theme) => theme.palette.error.main }}>
                        Your event must show on the public calendar, reservation list, or both!
                    </Typography>
                ) : null}
                <Box sx={{ height: 24 }} />
                <Typography
                    sx={{ display: { lg: 'inline', xs: 'block' }, marginRight: { lg: 2, xs: 0 }, fontWeight: 600 }}
                >
                    Repeating:
                </Typography>
                <ControlledCheckbox
                    control={control}
                    name="repeatsWeekly"
                    label="Repeats Weekly"
                    value={event.repeats === RepeatingStatus.WEEKLY}
                    setValue={setValue}
                    disabled={watchRepeatsMonthly || (event.repeatOriginId && event.repeatOriginId !== event.id)}
                />
                <ControlledCheckbox
                    control={control}
                    name="repeatsMonthly"
                    label="Repeats Monthly"
                    value={event.repeats === RepeatingStatus.MONTHLY}
                    setValue={setValue}
                    disabled={watchRepeatsWeekly || (event.repeatOriginId && event.repeatOriginId !== event.id)}
                />
                <DateInput
                    control={control}
                    name="repeatsUntil"
                    label="Repeat Until (Exclusive)"
                    value={event.repeatsUntil}
                    disabled={!watchRepeatsMonthly && !watchRepeatsWeekly}
                    errorMessage="Repeats Until must be after start time"
                    validate={() =>
                        (!watchRepeatsMonthly && !watchRepeatsWeekly) || watchRepeatsUntil.isAfter(watchStart)
                    }
                />
                {event.repeatOriginId && event.repeatOriginId !== event.id ? (
                    <React.Fragment>
                        <Typography sx={{ marginTop: 3 }}>
                            If you edit this repeating event instance, it will disassociate with the original event, and
                            any changes made to the original event will not impact this event.
                        </Typography>
                        <Link href={`/edit/events/${event.repeatOriginId}`}>
                            Go to the original event to make global edits to the event and repeating status.
                        </Link>
                    </React.Fragment>
                ) : null}
                {event.repeatOriginId && event.repeatOriginId === event.id ? (
                    <Typography sx={{ marginTop: 3 }}>
                        If you edit this event, all repeated instances of the event will be modified. Additionally, if
                        the time or repeating behavior is changed, repeated events will be recreated and exceptions will
                        be ignored.
                    </Typography>
                ) : null}
                <TwoButtonBox success="Submit" onCancel={back} submit right />
            </FormWrapper>
        </EditWrapper>
    );
};

export default EditEvents;
