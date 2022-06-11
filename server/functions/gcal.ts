import { google } from 'googleapis';
import { EventObject } from './types';

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
    const start = { dateTime: new Date(data.start).toISOString() };
    const end = { dateTime: new Date(data.end).toISOString() };
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
    const start = { dateTime: new Date(data.start).toISOString() };
    const end = { dateTime: new Date(data.end).toISOString() };
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
