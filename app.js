const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const data = require('./data.json');
const app = express();

// The only state variable (could replace with pure sheets calls but might hit api limits)
// TODO: Figure out how to use google drive webhooks so it automatically calls
var lastMod = 0;

// Configure the environmental variables and
// Check for the right env variables
dotenv.config();
if (process.env.CLIENT_EMAIL === undefined || process.env.PRIVATE_KEY === undefined) {
    console.error('Please have CLIENT_EMAIL and PRIVATE_KEY environmental variables defined');
    process.exit(1);
}

// Start web and 10 second interval for checking form additions
startWeb();
createEventIfMod();
setInterval(createEventIfMod, 10000);

/**
 * Starts the express frontend page
 */
function startWeb() {
    // Use public folder as static pages
    app.use(express.static(__dirname + '/public'));

    // Send homepage
    app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
    });

    // Form redirect
    app.get('/add', function (req, res, next) {
        res.redirect(data.links.feedback);
    });

    // Send to info document
    app.get('/info', function (req, res, next) {
        res.redirect(data.links.info);
    });

    app.get('/calendar/events', function (req, res, next) {
        res.redirect(data.links.eventCal);
    });

    app.get('/calendar/signups', function (req, res, next) {
        res.redirect(data.links.signupCal);
    });

    app.post('/update', function (req, res, next) {
        console.log(req.body);
        res.sendStatus(200);
    })

    // Start webpage on port
    app.listen(process.env.PORT || data.testPort, () =>
        console.log(`Listening on port ${process.env.PORT || data.testPort}`)
    );
}

/**
 * Creates the event if a new event was submitted
 */
function createEventIfMod() {
    const jwt = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY,
        data.scopes
    );
    const now = new Date();

    // Call the Google Auth API to authorize using the service account
    jwt.authorize(async (err, res) => {
        // Check if there has been a file change
        const change = await isFileChanged(jwt);
        if (!change) return;

        // Get the row to start reading entries from
        var p = await getStartingRow(jwt);

        // Get only the parsed entry number of rows
        var eventList = await getEventList(jwt, p);

        // Return if the eventlist is invalid
        if (eventList === undefined) return;

        // Parse the events and modify the list of events
        await parseEvents(eventList);

        // Create calendar event(s)
        await addEventToCalendar(jwt, eventList, now);

        // Update the processed count on sheet
        updateProcessedCount(jwt, p + eventList.length);
    });
}

/**
 * Checks to see if the file was changed, calling the Google Drive API
 * @param {object} jwt Service account auth object
 * @returns {Promise<boolean>} If the mod time has changed
 */
async function isFileChanged(jwt) {
    const fileRequest = {
        fileId: data.sheetId,
        fields: 'modifiedTime',
        auth: jwt,
    };

    const modTime = await google
        .drive('v3')
        .files.get(fileRequest)
        .then((data) => {
            var modTime = data.data.modifiedTime;
            modTime = modTime.substring(0, modTime.length - 1) + '+00:00';
            const modTimeUTC = new Date(modTime);
            return modTimeUTC.getTime();
        });

    if (modTime === lastMod) return false;
    lastMod = modTime;
    return true;
}

/**
 * Gets the row to start reading events from
 * @param {object} jwt Service account auth object
 * @returns {Promise<number>} How many rows processed + 2
 */
async function getStartingRow(jwt) {
    const countRequest = {
        spreadsheetId: data.sheetId,
        ranges: data.countCell,
        includeGridData: true,
        auth: jwt,
    };

    var p = await google
        .sheets('v4')
        .spreadsheets.get(countRequest)
        .then(async (data) => {
            return Number(data.data.sheets[0].data[0].rowData[0].values[0].formattedValue);
        });

    return p + 2;
}

/**
 * Gets the raw list of events
 * @param {object} jwt Service account auth object
 * @param {number} p The row to start reading events from
 * @returns {Promise<object[],number>} The list of raw event objects
 */
async function getEventList(jwt, p) {
    const sheetRequest = {
        spreadsheetId: data.sheetId,
        ranges: [
            `C${p}:C`,
            `D${p}:D`,
            `E${p}:E`,
            `F${p}:F`,
            `G${p}:G`,
            `H${p}:H`,
            `I${p}:I`,
            `J${p}:J`,
            `K${p}:K`
        ],
        includeGridData: true,
        auth: jwt,
    };
    const eventList = await google
        .sheets('v4')
        .spreadsheets.get(sheetRequest)
        .then(async (data) => {
            const rows = data.data.sheets[0].data;

            // Return if there are no edits
            if (rows[0].rowData === undefined) return undefined;

            // Create array of event objects
            var events = [];
            var descTemp;
            var signupTemp;
            for (var i = 0; i < rows[0].rowData.length; i++) {
                // Get description or check if empty
                if (rows[8].rowData == undefined) descTemp = '';
                else descTemp = rows[8].rowData[i].values[0].formattedValue;

                // Get signup checkbox or check if empty
                if (rows[6].rowData == undefined) signupTemp = '';
                else signupTemp = rows[6].rowData[i].values[0].formattedValue;

                // Create event object from row data
                events.push({
                    creator: rows[0].rowData[i].values[0].formattedValue,
                    summary: rows[1].rowData[i].values[0].formattedValue,
                    abbr: rows[2].rowData[i].values[0].formattedValue,
                    start: {
                        date: rows[3].rowData[i].values[0].formattedValue,
                        time: rows[4].rowData[i].values[0].formattedValue,
                    },
                    duration: rows[5].rowData[i].values[0].formattedValue,
                    location: rows[7].rowData[i].values[0].formattedValue,
                    description: descTemp,
                    signup: signupTemp === '' ? false : true,
                });
            }
            return events;
        });
    return eventList;
}

/**
 * Formats the event object to pass to the Google Calendar API
 * Changes the attributes in the list by reference (https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing)
 * @param {object[]} eventList List of events that is passed in through 'call by sharing'
 */
async function parseEvents(eventList) {
    // Parse the list of events
    eventList.forEach((e) => {
        // Remove AM/PM thing
        var timePreList = e.start.time.split(' ');

        // Calculate start time and date
        var dateList = e.start.date.split('/');
        var timeList = timePreList[0].split(':');

        // Change to 24-hr time
        if (timePreList[1] === 'PM' && timeList[0] !== '12')
            timeList[0] = (Number(timeList[0]) + 12).toString();
        if (timeList[1] === 'AM' && timeList[0] === '12') timeList[0] = '00';

        // Create the ISO datetime string & save to start
        var dateStr =
            `${dateList[2]}-${pad(dateList[0])}-${pad(dateList[1])}` +
            `T${pad(timeList[0])}:${pad(timeList[1])}:${pad(timeList[2])}.000`;

        // Create date object
        var dat = new Date(dateStr);
        var millis = dat.getTime();

        // Calculate end time using milliseconds
        var dList = e.duration.split(':');
        millis += Number(dList[0]) * 3600000 + Number(dList[1]) * 60000 + Number(dList[2]) * 1000;
        var endStr = new Date(Number(millis)).toISOString();

        // Save start and end times to list, USING the correct time zone
        e.start = { dateTime: dat.toISOString(), timeZone: 'America/Chicago' };
        e.end = { dateTime: endStr, timeZone: 'America/Chicago' };

        // Signups have 0 duration
        if (e.signup) e.end = e.start;

        // Add contact name to description and check for empty description
        if (e.description !== '')
            e.description = `<b>${e.description}</b><br><em>Added by: ${e.creator}</em>`;
        else e.description = `<b>[No description]</b><br><em>Added by: ${e.creator}</em>`;

        // Add the abbreviation to the title
        e.summary = `[${e.abbr}] ${e.summary}`;

        // Remove the duration, contact, and abbr params
        delete e.duration;
        delete e.creator;
        delete e.abbr;
    });
}

/**
 * Add events to the Google Calender through the Google Calendar API
 * @param {JWT} jwt Service account auth object
 * @param {object[]} eventList The list of events
 * @param {Date} now The current time object
 */
async function addEventToCalendar(jwt, eventList, now) {
    eventList.forEach((e) => {
        const calRequest = {
            auth: jwt,
            calendarId: e.signup ? data.calendarId.signups : data.calendarId.events,
            resource: e,
        };
        google.calendar('v3').events.insert(calRequest, function (err, event) {
            if (err) {
                console.log(`[${now.toISOString()}] There was an error creating event: ${err}`);
                return;
            }
            console.log(`[${now.toISOString()}] Event created: ${event.data.htmlLink}`);
        });
    });
}

/**
 * Updates the count on the sheet through Google Sheets API
 * @param {JWT} jwt Service account auth object
 * @param {number} p The row that the last event was on
 */
async function updateProcessedCount(jwt, p) {
    const updateRequest = {
        spreadsheetId: data.sheetId,
        valueInputOption: 'USER_ENTERED',
        range: COUNT_CELL,
        resource: { values: [[(p - 2).toString()]] },
        auth: jwt,
    };
    google.sheets('v4').spreadsheets.values.update(updateRequest);
}

/**
 * Adds a 0 in front if single number
 * @param {string} input
 */
function pad(input) {
    if (input.length > 1) return input;
    return '0' + input;
}
