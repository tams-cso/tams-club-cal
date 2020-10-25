const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const app = express();
const config = require('./config.json');
const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
];
const PORT = 5000;

dotenv.config();
startWeb();
checkMod();

function startWeb() {
    // Create static webpage
    app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // Start webpage on port
    app.listen(process.env.PORT || PORT, () =>
        console.log(`Listening on port ${process.env.PORT || PORT}`)
    );
}

function checkMod() {
    const jwt = new google.auth.JWT(config.client_email, null, config.private_key, scopes);
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
        const currTime = new Date();
        
        // Return if the last modification was more than 10 seconds ago (+5 seconds for api lag)
        if (modTime < currTime.getTime() - 15000) return;

        // However, if a new entry was added:

    });
}
