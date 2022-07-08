import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import dayjs, { Dayjs } from 'dayjs';
import { createPopupEvent, createEvent, getTokenFromCookies } from '../../../src/util';
import { darkSwitch } from '../../../src/util/cssUtil';
import { getEvent, getOverlappingReservations, getUserInfo, postEvent, putEvent } from '../../../src/api';
import { AccessLevel, EventType, PopupEvent } from '../../../src/types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import DateTimeInput from '../../../src/components/edit/events/date-time-input';
import ControlledCheckbox from '../../../src/components/edit/events/controlled-checkbox';
import ControlledTextField from '../../../src/components/edit/shared/controlled-text-field';
import UploadBackdrop from '../../../src/components/edit/shared/upload-backdrop';
import TwoButtonBox from '../../../src/components/shared/two-button-box';
import LocationSelect from '../../../src/components/edit/events/location-select';
import AddButton from '../../../src/components/shared/add-button';
import FormWrapper from '../../../src/components/edit/shared/form-wrapper';
import Spacer from '../../../src/components/shared/spacer';
import Popup from '../../../src/components/shared/popup';
import EditWrapper from '../../../src/components/edit/shared/edit-wrapper';
import Link from '../../../src/components/shared/Link';
import TitleMeta from '../../../src/components/meta/title-meta';
import RobotBlockMeta from '../../../src/components/meta/robot-block-meta';

import data from '../../../src/data.json';
import UnauthorizedAlert from '../../../src/components/edit/shared/unauthorized-alert';
import DeleteButton from '../../../src/components/shared/delete-button';
import ControlledSelect from '../../../src/components/edit/shared/controlled-select';
import { MenuItem } from '@mui/material';

// Object for holding form data
type SubmitData = {
    name: string;
    type: EventType;
    club: string;
    location: string;
    otherLocation: string;
    start: Dayjs;
    end: Dayjs;
    date: Dayjs;
    noEnd: boolean;
    description: string;
    hideEvent: boolean;
};

// List of locations to not create reservations for
const noReservationLocations = ['none', 'other', 'online'];

// Server-side Rendering
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    // Get editor information
    const token = getTokenFromCookies(ctx);
    const userRes = await getUserInfo(token);
    const userId = userRes.status === 200 ? userRes.data.id : null;
    const level = userId ? userRes.data.level : AccessLevel.NONE;

    // Check if adding event
    const id = ctx.params.id as string;
    if (!id) return { props: { event: createEvent(), id: null, error: false, userId, level, duplicate: false } };

    // Get event info
    const eventRes = await getEvent(id);
    const error = eventRes.status !== 200;
    const event = error ? createEvent() : eventRes.data;

    // Check if duplicating event
    const duplicate = (ctx.query.duplicate as string) === '1';

    return { props: { event, error, id: error ? null : id, userId, level, duplicate } };
};

/**
 * Main form for editing and adding events
 */
const EditEvents = ({
    event,
    id,
    error,
    userId,
    level,
    duplicate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
    const watchLocation: string = watch('location');
    const watchOtherLocation: string = watch('otherLocation');
    const watchHideEvent: boolean = watch('hideEvent');

    // When the user submits the form, either create or update the event
    const onSubmit = async (data: SubmitData) => {
        // Calculate the start and end times
        // For the end time, if noEnd, simply set to the same as the start time
        const startTime = data.start.valueOf();
        const endTime = data.noEnd ? startTime : data.end.valueOf();

        // Make sure events do not last for more than 100 days
        if (dayjs(endTime).diff(startTime, 'day') > 100) {
            setPopupEvent(createPopupEvent('Events cannot last more than 100 days!', 3));
            return;
        }

        // Make sure reservations are in the valid period

        // Start the upload process display because the reservation might take a bit to find
        setBackdrop(true);

        // Check for the conditions for creating a reservation
        // If noEnd is true OR location is none/other/online, don't create a reservation
        const createReservation = !data.noEnd && noReservationLocations.indexOf(data.location) === -1;
        if (createReservation) {
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
            if (overlaps.data.length !== 0 && overlaps.data[0].id !== event.id) {
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
            userId,
            data.name,
            data.type,
            data.club,
            data.description,
            startTime,
            endTime,
            data.location === 'other' ? data.otherLocation : data.location,
            data.noEnd,
            !data.hideEvent,
            createReservation
        );

        // If the event ID is null OR it's a duplicate, create the event, otherwise update it
        const addEvent = id === null || duplicate;
        const res = addEvent ? await postEvent(newEvent) : await putEvent(newEvent, id);

        // Finished uploading
        setBackdrop(false);

        // If the event was created successfully, redirect to the event page, otherwise display an error
        if (res.status === 204) {
            new Cookies().set('success', !addEvent ? 'update-event' : 'add-event', {
                sameSite: 'strict',
                path: '/',
            });
            back(null, addEvent);
        } else setPopupEvent(createPopupEvent('Unable to upload data. Please refresh the page or try again.', 4));
    };

    // Returns the user back to the event display page
    const back = (_event, addEvent = false) => {
        if (addEvent) router.push('/events');
        else router.push(`/events${id ? `/${id}` : ''}`);
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
        setPrevStart(event.start);
    }, []);

    // Change start and end times if event changes
    useEffect(() => {
        setValue('start', dayjs(event.start));
    }, [event]);

    // Offset the end time if startTime is changed to the same duration
    useEffect(() => {
        if (!watchEnd || errors.end) return;
        const diff = watchEnd.valueOf() - prevStart;
        setValue('end', dayjs(watchStart.valueOf() + diff));
        setPrevStart(watchStart.valueOf());
    }, [watchStart]);

    // Set an error if the end time is set before the start time
    useEffect(() => {
        if (!watchEnd) return;
        if (watchNoEnd) {
            clearErrors('end');
            return;
        }
        if (watchEnd.isBefore(watchStart)) setError('end', { message: 'End is before start' });
        else clearErrors('end');
    }, [watchStart, watchEnd, watchNoEnd]);

    // Check to see if the other location is empty and clear errors if the location is changed
    useEffect(() => {
        if (watchLocation !== 'other') {
            clearErrors('otherLocation');
        }
    }, [watchLocation]);

    // Set display error if neither public or reservation is selected
    useEffect(() => {
        setDisplayError(watchHideEvent && noReservationLocations.indexOf(watchLocation) !== -1);
    }, [watchHideEvent, watchLocation]);

    // If the location is a custom one, replace with "other" in form
    const defaultLocation = id
        ? event.location === 'none'
            ? 'none'
            : data.rooms.findIndex((r) => r.value === event.location) === -1
            ? 'other'
            : event.location
        : 'none';

    const unauthorized =
        (level < AccessLevel.STANDARD || (!id ? false : event.editorId !== userId)) && level !== AccessLevel.ADMIN;

    return (
        <EditWrapper>
            <TitleMeta title={`${id && !duplicate ? 'Edit' : 'Add'} Event`} path={`/edit/events/${id ? id : ''}`} />
            <RobotBlockMeta />
            <UploadBackdrop open={backdrop} />
            <Popup event={popupEvent} />
            <Typography variant="h1" sx={{ textAlign: 'center', fontSize: '3rem' }}>
                {id && !duplicate ? 'Edit Event' : 'Add Event'}
            </Typography>
            <UnauthorizedAlert show={unauthorized} resource="event" />
            {id ? (
                <React.Fragment>
                    <AddButton editHistory path={`/edit/history/events/${id}`} />
                    <DeleteButton
                        resource="events"
                        id={id}
                        name={event.name}
                        hidden={!id || duplicate || unauthorized}
                    />
                </React.Fragment>
            ) : null}
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                {id && !duplicate ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                        <Link href={`/edit/events/${id}?duplicate=1`}>Duplicate this event</Link>
                    </Box>
                ) : null}
                {duplicate ? (
                    <Alert
                        severity="info"
                        sx={{ marginBottom: 3, backgroundColor: (theme) => darkSwitch(theme, null, '#304249') }}
                    >
                        This is a duplicate of a previous event and will create a completely new event.
                        <Link
                            href={`/edit/events/${event.id}`}
                            sx={{ color: (theme) => darkSwitch(theme, theme.palette.primary.dark, null) }}
                        >
                            {' '}
                            Click here to see the original event.
                        </Link>
                    </Alert>
                ) : null}
                <Box sx={{ marginBottom: 3, display: 'flex', flexDirection: { lg: 'row', xs: 'column' } }}>
                    <ControlledSelect
                        control={control}
                        setValue={setValue}
                        value={event.type}
                        name="type"
                        label="Event Type"
                        variant="outlined"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="event">Event</MenuItem>
                        <MenuItem value="ga">GA</MenuItem>
                        <MenuItem value="meeting">Meeting</MenuItem>
                        <MenuItem value="volunteering">Volunteering</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </ControlledSelect>
                    <Spacer />
                    <ControlledTextField
                        control={control}
                        setValue={setValue}
                        value={event.name}
                        label="Event Name"
                        name="name"
                        variant="outlined"
                        required
                        grow
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
                    <DateTimeInput
                        control={control}
                        name="start"
                        label={watchNoEnd ? 'Date/time' : 'Start date/time'}
                        value={event.start}
                        required
                    />
                    <Spacer />
                    <DateTimeInput
                        name="end"
                        label="End date/time"
                        control={control}
                        value={event.end}
                        disabled={watchNoEnd}
                        errorMessage="End time cannot be before start time"
                        validate={() => watchNoEnd || watchStart.isBefore(watchEnd)}
                        required
                        end
                    />
                    <ControlledCheckbox
                        control={control}
                        name="noEnd"
                        label="No end time"
                        value={event.noEnd}
                        setValue={setValue}
                        sx={{ marginLeft: { lg: 2, xs: 0 }, marginTop: { lg: 0, xs: 2 } }}
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
                    name="hideEvent"
                    label="Hide from the public calendar (This will be shown ONLY on the reservation calendar)"
                    value={!event.publicEvent}
                    setValue={setValue}
                    sx={{ display: 'block' }}
                />
                {displayError ? (
                    <Typography sx={{ color: (theme) => theme.palette.error.main }}>
                        You may not hide events that do not have a reservation! (Because they would literally not show
                        up anywhere)
                    </Typography>
                ) : null}
                <TwoButtonBox success="Submit" onCancel={back} submit right disabled={unauthorized} />
            </FormWrapper>
        </EditWrapper>
    );
};

export default EditEvents;
