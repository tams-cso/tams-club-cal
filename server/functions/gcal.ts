import dayjs from 'dayjs';
import { calendar_v3, google } from 'googleapis';
import { EventObject, RepeatingStatus } from './types';

authorize();

async function authorize() {
    var jwt = new google.auth.JWT(
        process.env.SERVICE_EMAIL,
        null,
        process.env.SERVICE_PRIVATE_KEY,
        'https://www.googleapis.com/auth/calendar'
    );
    await jwt.authorize();
    google.options({ auth: jwt });
    console.log('Authorized google api service account!');
}

/**
 * Creates a Google Calendar entry given the event object and returns the id.
 * Will throw an error if the request fails for any reason.
 */
export async function addToCalendar(data: EventObject): Promise<string> {
    const start = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD') }
        : { dateTime: new Date(data.start).toISOString() };
    const end = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD') }
        : { dateTime: new Date(data.end).toISOString() };
    const res = await google.calendar('v3').events.insert({
        calendarId: process.env.CALENDAR_ID,
        requestBody: {
            start,
            end,
            summary: `${data.name} (${data.club})`,
            description: data.description,
        },
    });
    return res.data.id;
}

/**
 * Updates a Google Calendar entry given the event object and the id
 *
 * @param data Event data to update on the calendar
 * @param id Google Calendar event ID to update
 */
export async function updateCalendar(data: EventObject, id: string): Promise<void> {
    const start = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD') }
        : { dateTime: new Date(data.start).toISOString() };
    const end = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD') }
        : { dateTime: new Date(data.end).toISOString() };
    await google.calendar('v3').events.update({
        calendarId: process.env.CALENDAR_ID,
        eventId: id,
        requestBody: {
            start,
            end,
            summary: `${data.name} (${data.club})`,
            description: data.description,
        },
    });
}

/**
 * Will delete an event from the Google Calendar
 *
 * @param id ID of the Google Calendar event
 */
export async function deleteCalendarEvent(id: string): Promise<void> {
    await google.calendar('v3').events.delete({ calendarId: process.env.CALENDAR_ID, eventId: id });
}

// All the following functions will operate on REPEATING events
// This is a hellhole, so hold on tight kids!
// Here's the documentation, if you prefer to read through lines and lines of nonsense:
// https://developers.google.com/calendar/api/guides/recurringevents

/**
 * Create a calendar event for the repeating event
 */
export async function addRecurringToCalendar(data: EventObject): Promise<string[]> {
    try {
        // Calculate start time
        const start = data.allDay
            ? { date: dayjs(data.start).format('YYYY-MM-DD'), timeZone: 'Etc/UTC' }
            : { dateTime: new Date(data.start).toISOString(), timeZone: 'Etc/UTC' };

        // Calculate end time
        const end = data.allDay
            ? { date: dayjs(data.start).format('YYYY-MM-DD'), timeZone: 'Etc/UTC' }
            : { dateTime: new Date(data.end).toISOString(), timeZone: 'Etc/UTC' };

        // Calculate repeating and end status
        const freq = data.repeats === RepeatingStatus.WEEKLY ? 'WEEKLY' : 'MONTHLY';
        const until = dayjs(data.repeatsUntil).startOf('day').subtract(1, 'second').format('YYYYMMDD');

        // Insert the original repeating event into the calendar
        const insertRes = await google.calendar('v3').events.insert({
            calendarId: process.env.CALENDAR_ID,
            requestBody: {
                start,
                end,
                summary: `${data.name} (${data.club})`,
                description: data.description,
                recurrence: [`RRULE:FREQ=${freq};UNTIL=${until}`],
            },
        });

        // Get the list of all repeating events
        const res = await google.calendar('v3').events.instances({
            calendarId: process.env.CALENDAR_ID,
            eventId: insertRes.data.id,
        });

        // Map IDs to string then replace the first ID with the recurringEventId
        const ids = res.data.items.map((e) => e.id);
        ids[0] = res.data.items[0].recurringEventId;
        return ids;
    } catch (error) {
        throw error;
    }
}

/**
 * Updates the event on the recurring calendar, lengthening or shortening the event if needed
 *
 * @param data New event data
 * @param id ID of the calendar event to update
 * @param isLonger True if event repeats for longer; will return list ids
 */
export async function updateRecurringCalendar(
    data: EventObject,
    id: string,
    isLonger: boolean = false
): Promise<calendar_v3.Schema$Event[]> {
    // Calculate start time
    const start = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD'), timeZone: 'Etc/UTC' }
        : { dateTime: new Date(data.start).toISOString(), timeZone: 'Etc/UTC' };

    // Calculate end time
    const end = data.allDay
        ? { date: dayjs(data.start).format('YYYY-MM-DD'), timeZone: 'Etc/UTC' }
        : { dateTime: new Date(data.end).toISOString(), timeZone: 'Etc/UTC' };

    // Calculate repeating and end status
    const freq = data.repeats === RepeatingStatus.WEEKLY ? 'WEEKLY' : 'MONTHLY';
    const until = dayjs(data.repeatsUntil).startOf('day').subtract(1, 'second').format('YYYYMMDD');

    await google.calendar('v3').events.update({
        calendarId: process.env.CALENDAR_ID,
        eventId: id,
        requestBody: {
            start,
            end,
            summary: `${data.name} (${data.club})`,
            description: data.description,
            recurrence: [`RRULE:FREQ=${freq};UNTIL=${until}`],
        },
    });

    if (!isLonger) return null;

    // Get the list of all repeating events
    const res = await google.calendar('v3').events.instances({
        calendarId: process.env.CALENDAR_ID,
        eventId: id,
    });

    // Return those items lol
    return res.data.items;
}
