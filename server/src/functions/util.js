const { Document } = require('mongoose');
const { Request } = require('express');
const uuid = require('uuid');

const statusList = require('../files/status.json');
const envList = require('../files/env.json');
const History = require('../models/history');

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
 * @param {Request} req Express request object
 * @returns {string} IP address of the user
 */
function getIp(req) {
    return req.headers['x-real-ip'] || req.ip;
}

/**
 * Creates the editor object, where it will first save the ID, and if not avaliable, then it
 * will save the ip address of the client that edited the resource.
 *
 * @param {Request} req Express request object
 * @returns {object} Returns { id, ip } with only one of them null, where id takes priority
 */
function getEditor(req) {
    const authorization = req.headers['authorization'];
    if (authorization) return { id: authorization.substring(7), ip: null };
    else return { id: null, ip: getIp(req) };
}

/**
 * Creates a history object given the data of the newly created resource.
 * If prevData is not defined, it will simply convert the fields of the data
 * passed in to a key/value pair, or else it will run the diff between the
 * previous and new data (in req.body).
 *
 * @param {Request} req Express request object
 * @param {Document} data Resource data (either new data or previous data depending on "isNew")
 * @param {string} resource Resource name
 * @param {string} id UUIDv4 for the resource
 * @param {string} historyId UUIDv4 for the history object
 * @param {boolean} [isNew] True if a new resource (default: true)
 * @param {object} [club] Will use club object instead of req.body to get diff if defined
 * @returns {Document} The history document
 */
function createNewHistory(req, data, resource, id, historyId, isNew = true, club = null) {
    return new History({
        id: historyId,
        resource,
        editId: id,
        time: new Date().valueOf(),
        editor: getEditor(req),
        fields: isNew ? objectToHistoryObject(data.toObject()) : getDiff(data.toObject(), club || req.body),
    });
}

/**
 * Creates a history "fields" object from a created object.
 * All fields that start with _ or is "id"/"history" will be omitted.
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
    return parsedFields.filter((f) => !f.key.startsWith('_') && f.key !== 'id' && f.key !== 'history');
}

/**
 * Creates a history "fields" object from a created object.
 * All fields that start with _ or is "id" will be omitted.
 * This will compare the previous data with the current data and save all changes.
 *
 * @param {object} prevData Previous data object
 * @param {object} data Data object
 * @returns {object} History fields object
 */
function getDiff(prevData, data) {
    let output = [];
    Object.entries(data).forEach(([key, value]) => {
        if (prevData[key] === value) return;
        if (key.startsWith('_' || key === 'id' || key === 'history')) return;
        output.push({
            key,
            oldValue: prevData[key],
            newValue: value,
        });
    });
    return output;
}

module.exports = { checkEnv, sendError, newId, getIp, getEditor, createNewHistory };
