const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const statusList = require('./status.json');

/**
 * Sends an error with the provided status
 * (see: https://httpstatuses.com/) and error message
 *
 * @param {import("express").Response} res The express response object
 * @param {number} status The error status code
 * @param {string} message The message to send the user
 */
function sendError(res, status, message) {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status} ${statusList[status]}`,
        error: message,
    });
}

/**
 * Writes request to main log file
 *
 * @param {import("express").Request} req The express response object
 */
function logRequest(req) {
    var url = req.url;
    const keyIndex = url.indexOf('?key=');
    if (keyIndex !== -1) url = url.substring(0, keyIndex) + url.substring(keyIndex + 38, url.length);
    const data = `[${new Date().toISOString()}] ${req.method} ${url}\n`;
    fs.appendFile(path.join(__dirname, 'logs', 'main.log'), data, (err) => {
        if (err) console.dir(err);
    });
}

/**
 * Parses a multipart form club upload and returns the data in a callback function
 * @param {import('express').Request} req The Express request object
 * @param {import('express').Response} res The Express response object
 * @param {Function} callback Callback function to run after parsing the form, passes in the club object as a parameter
 */
async function parseForm(req, res, callback) {
    // Import this function here to avoid circular dependencies
    const { uploadImage } = require('./images');
    
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            sendError(res, 400, 'Invalid form response');
            return;
        }

        var club = JSON.parse(fields.data);
        if (club.coverImgBlobs.img !== null) {
            club.coverImgThumbnail = await uploadImage(files.thumb, club.coverImgThumbnail);
            club.coverImg = await uploadImage(files.img, club.coverImg);
        }
        for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
            if (club.execProfilePicBlobs[i] !== null) {
                if (req.query.update) club.execs[i].img = await uploadImage(files[`exec${i}`], club.oldExecs[i].img);
                else club.execs[i].img = await uploadImage(files[`exec${i}`]);
            }
        }

        callback(club);
    });
}

/**
 * Extracts the IP address from the header of the express request object
 * 
 * @param {import('express').Request} req Express request object
 */
function getIp(req) {
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
}

module.exports = { sendError, logRequest, parseForm, getIp };
