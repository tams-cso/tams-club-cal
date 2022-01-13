import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';
import { createPopupEvent, createEvent } from '../../../src/util';
import type { PopupEvent } from '../../../src/entries';
import { getEvent, getOverlappingReservations, postEvent, putEvent } from '../../../src/api';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import DateTimeInput from '../../../src/components/edit/events/date-time-input';
import ControlledCheckbox from '../../../src/components/edit/events/controlled-checkbox';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import ControlledSelect from '../../../src/components/edit/shared/controlled-select';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import Loading from '../../../src/components/shared/loading';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import LocationSelect from '../../../src/components/edit/shared/location-select';
import DateInput from '../../../src/components/edit/events/date-input';
import AddButton from '../../../src/components/shared/add-button';
import Title from '../../../src/components/shared/title';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';

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

    // When the user submits the form, either create or update the event
    const onSubmit = async (data) => {
        // If the name is empty, do nothing
        if (!('name' in data)) return;

        // Calculate the start and end times
        const startTime = data.allDay ? data.date.startOf('day').valueOf() : data.start.valueOf();
        const endTime = data.allDay || data.noEnd ? startTime : data.end.valueOf();

        // Make sure start > end
        if (endTime < startTime) {
            setPopupEvent(createPopupEvent('Start time should be before end time!', 3));
            return;
        }

        // Create or delete reservation if the state of the checkbox changes
        let resId = event.reservationId;

        // Start the upload process display because the reservation might take a bit to find
        setBackdrop(true);

        // Delete or create a reservation if the proper conditions are met
        if (event.reservationId === null && data.createReservation) {
            // Check to see if preconditions for creating a reservation are met
            if (data.location === 'none' || data.noEnd) {
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
            if (overlaps.data.length !== 0 && overlaps.data[0].id !== resId) {
                setPopupEvent(createPopupEvent('There is already a reservation during that time!', 3));
                setBackdrop(false);
                return;
            }
            resId = 1;
        } else if (event.reservationId !== null && !data.createReservation) {
            resId = -1;
        }

        // Create the event object from the data
        const newEvent = createEvent(
            id,
            event.eventId,
            `${resId}`,
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
        if (watchEnd === undefined || watchNoEnd) return;
        if (watchAllDay) {
            clearErrors('end');
            return;
        }
        if (watchEnd.isBefore(watchStart)) setError('end', { message: 'End is before start' });
        else clearErrors('end');
    }, [watchStart, watchEnd, watchAllDay]);

    // Set the date of the "all day" date input to the same as the start time
    useEffect(() => {
        if (watchAllDay) setValue('date', watchStart);
    }, [watchAllDay]);

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
        </EditWrapper>
    );
};

export default EditEvents;
