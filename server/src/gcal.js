const creds = require('../creds.json');
const { google } = require('googleapis');
const { addEventCalendarId, getEventCalendarId } = require('./database');

const hasCreds = creds.type === 'service_account' && process.env.CALENDAR_ID !== undefined;
if (!hasCreds) {
    console.log('[ERROR] Service account and calendar ID undefined');
    process.exit(1);
}

async function authorize() {
    var jwt = new google.auth.JWT(
        creds.client_email,
        null,
        creds.private_key,
        'https://www.googleapis.com/auth/calendar'
    );
    await jwt.authorize();
    google.options({ auth: jwt });
    console.log('Authorized service account');
}

async function addToCalendar(data, objId) {
    try {
        const res = await google.calendar('v3').events.insert({
            calendarId: process.env.CALENDAR_ID,
            requestBody: {
                start: { dateTime: new Date(data.start).toISOString() },
                end: { dateTime: new Date(data.end).toISOString()},
                summary: `${data.name} (${data.club})`,
                description: data.description,
            },
        });
        addEventCalendarId(objId, res.data.id);
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

async function updateCalendar(data, id) {
    try {
        const res = await getEventCalendarId(id);
        if (res.good !== 1) return -1;
        await google.calendar('v3').events.update({
            calendarId: process.env.CALENDAR_ID,
            eventId: res.ids.eventId,
            requestBody: {
                start: { dateTime: new Date(data.start).toISOString() },
                end: { dateTime: new Date(data.end).toISOString()},
                summary: `${data.name} (${data.club})`,
                description: data.description,
            },
        });
        return 1;
    } catch (error) {
        console.dir(error);
        return -1;
    }
}

module.exports = { addToCalendar, updateCalendar };
