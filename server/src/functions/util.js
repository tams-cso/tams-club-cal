const formidable = require('formidable');
const crypto = require('crypto');
const uuid = require('uuid');

const statusList = require('../files/status.json');
const envList = require('../files/env.json');

/**
 * Checks that all the neccessary environmental variables
 * are defined before running the app.
 * The function will throw an error and exit the app if
 * a variable is missing.
 */
function checkEnv() {
    envList.forEach((e) => {
        if (process.env[e] === undefined) {
            console.error(`ERROR: The ${e} environmental variable was not defined.`);
            process.exit(1);
        }
    });
}

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
 * Creates and returns a new UUIDv4
 * @returns {string} UUIDv4
 */
function newId() {
    return uuid.v4();
}

/**
 * Extracts the IP address from the header of the express request object
 *
 * @param {import('express').Request} req Express request object
 * @returns {string} IP address of the user
 */
function getIp(req) {
    return req.headers['x-real-ip'] || req.ip;
}

/**
 * Creates the editor object, where it will first save the ID, and if not avaliable, then it
 * will save the ip address of the client that edited the resource.
 *
 * @param {import('express').Request} req Express request object
 * @returns {object} Returns { id, ip } with only one of them null, where id takes priority
 */
function getEditor(req) {
    const authorization = req.headers['authorization'];
    if (authorization) return { id: authorization.substring(7), ip: null };
    else return { id: null, ip: getIp(req) };
}

/**
 * Creates a history "fields" object from a created object.
 * All fields that start with _ or is "id" will be omitted.
 * This will simply map all key value pairs to "keys" and "newValue".
 *
 * @param {object} data Data object
 * @returns {object} History object split into keys and "newValue". "oldValue" will simply be null
 */
function objectToHistoryObject(data) {
    const parsedFields = Object.entries(data).map(([key, value]) => ({
        key,
        oldValue: null,
        newValue: value,
    }));
    return parsedFields.filter((f) => !f.key.startsWith('_') && f.key !== 'id');
}

/**
 * Parses a multipart form club upload and returns the data in a callback function
 * @param {import('express').Request} req The Express request object
 * @param {import('express').Response} res The Express response object
 * @param {Function} callback Callback function to run after parsing the form, passes in the club object as a parameter
 */
async function parseForm(req, res, callback) {
    // Import this function here to avoid circular dependencies
    const { uploadImage } = require('../images');

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            sendError(res, 400, 'Invalid form response');
            return;
        }

        var club = JSON.parse(fields.data);

        // Check for old pictures
        var oldImages = [];
        if (hasOldPicture(club.coverImgThumbnail)) oldImages.push(club.coverImgThumbnail);
        if (hasOldPicture(club.coverImg)) oldImages.push(club.coverImg);

        if (club.coverImgBlobs.img !== null) {
            club.coverImgThumbnail = await uploadImage(files.thumb);
            club.coverImg = await uploadImage(files.img);
        }
        for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
            if (club.execProfilePicBlobs[i] !== null) {
                if (req.query.update) {
                    if (hasOldPicture(club.oldExecs[i].img)) oldImages.push(club.oldExecs[i].img);
                    club.execs[i].img = await uploadImage(files[`exec${i}`]);
                } else club.execs[i].img = await uploadImage(files[`exec${i}`]);
            }
        }

        callback(club, oldImages);
    });
}

async function hasOldPicture(oldId) {
    return oldId !== null && oldId !== undefined && oldId.startsWith('/') && typeof oldId === 'string';
}

/**
 * Generates a 16 byte hex state
 *
 * @returns {string} String representing the state
 */
function genState() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = { checkEnv, sendError, newId, objectToHistoryObject, parseForm, getIp, getEditor, genState };
