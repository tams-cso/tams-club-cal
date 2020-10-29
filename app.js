const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const app = express();
const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
];
const PORT = 5000;
var lastMod = 0;

// Configure the environmental variables
dotenv.config();

// Check for the right env variables
if (process.env.SHEET_ID === undefined || process.env.CALENDAR_ID === undefined ||
    process.env.CLIENT_EMAIL === undefined || process.env.PRIVATE_KEY === undefined) {
    console.error('Please have SHEET_ID, CALENDAR_ID, CLIENT_EMAIL, and PRIVATE_KEY environmental variables defined');
    process.exit(1);
}

// Start web and 15 second interval for checking form additions
startWeb();
createEventIfMod();
setInterval(createEventIfMod, 10000);

function startWeb() {
    // Use public folder as static pages
    app.use(express.static(__dirname + '/public'));

    // Send homepage
    app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
    });

    // Start webpage on port
    app.listen(process.env.PORT || PORT, () =>
        console.log(`Listening on port ${process.env.PORT || PORT}`)
    );
}

function createEventIfMod() {
    const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes);
    const now = new Date();
    jwt.authorize(async (err, res) => {
        const fileRequest = {
            fileId: process.env.SHEET_ID,
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

        if (modTime === lastMod) return;
        lastMod = modTime;

        // However, if a new entry was added:
        // First get the number of parsed entries:
        const countRequest = {
            spreadsheetId: process.env.SHEET_ID,
            ranges: ['K1'],
            includeGridData: true,
            auth: jwt,
        };
        var p = await google
            .sheets('v4')
            .spreadsheets.get(countRequest)
            .then(async (data) => {
                return Number(data.data.sheets[0].data[0].rowData[0].values[0].formattedValue);
            });
        p += 2;

        // Get only the parsed entry number of rows
        const sheetRequest = {
            spreadsheetId: process.env.SHEET_ID,
            ranges: [`C${p}:C`, `D${p}:D`, `E${p}:E`, `F${p}:F`, `G${p}:G`, `H${p}:H`, `I${p}:I`],
            includeGridData: true,
            auth: jwt,
        };
        const eventList = await google
            .sheets('v4')
            .spreadsheets.get(sheetRequest)
            .then(async (data) => {
                const rows = data.data.sheets[0].data;
                if (rows[0].rowData === undefined) return undefined;
                var events = [];
                for (var i = 0; i < rows[0].rowData.length; i++) {
                    p++;
                    
                    if (rows[6].rowData == undefined) descTemp = ' ';
                    else descTemp = rows[6].rowData[i].values[0].formattedValue;

                    events.push({
                        summary: rows[0].rowData[i].values[0].formattedValue,
                        contact: rows[1].rowData[i].values[0].formattedValue,
                        start: {
                            date: rows[2].rowData[i].values[0].formattedValue,
                            time: rows[3].rowData[i].values[0].formattedValue,
                        },
                        duration: rows[4].rowData[i].values[0].formattedValue,
                        location: rows[5].rowData[i].values[0].formattedValue,
                        description: descTemp,
                    });
                }
                return events;
            });
        
        // Return if the eventlist is invalid
        if (eventList === undefined) return;

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
            millis +=
                Number(dList[0]) * 3600000 + Number(dList[1]) * 60000 + Number(dList[2]) * 1000;
            var endStr = new Date(Number(millis)).toISOString();

            // Save start and end times to list, USING the correct time zone
            e.start = { dateTime: dat.toISOString(), timeZone: 'America/Chicago' };
            e.end = { dateTime: endStr, timeZone: 'America/Chicago' };

            // Add contact name to description
            e.description = `<b>Contact Person: ${e.contact}</b><br>` + e.description;

            // Remove the duration and contact params
            delete e.duration;
            delete e.contact;
        });

        // Create a calendar event
        eventList.forEach((e) => {
            const calRequest = {
                auth: jwt,
                calendarId: process.env.CALENDAR_ID,
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

        // Update the processed count on sheet
        const updateRequest = {
            spreadsheetId: process.env.SHEET_ID,
            valueInputOption: 'USER_ENTERED',
            range: 'K1',
            resource: { values: [[(p - 2).toString()]] },
            auth: jwt,
        };
        google.sheets('v4').spreadsheets.values.update(updateRequest);
    });
}

/**
 * Adds a 0 in front if single number
 * @param {string} input
 */
function pad(input) {
    if (input.length > 1) return input;
    return '0' + input;
}
