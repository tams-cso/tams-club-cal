const { Document } = require('mongoose');
const { Request } = require('express');
const uuid = require('uuid');

const statusList = require('../files/status.json');
const envList = require('../files/env.json');
const History = require('../models/history');
const User = require('../models/user');

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
 * @returns {Promise<object>} Returns { id, ip } with only one of them null, where id takes priority
 */
async function getEditor(req) {
    const authorization = req.headers['authorization'];
    const token = authorization ? await User.findOne({ token: authorization.substring(7) }) : null;
    if (token) return { id: token.id, ip: null };
    else return { id: null, ip: getIp(req) };
}

/**
 * Creates a history object given the data of the newly created resource.
 * If prevData is not defined, it will simply convert the fields of the data
 * passed in to a key/value pair, or else it will run the diff between the
 * previous and new data (in req.body).
 * // TODO: Should this be renamed to createHistory?
 *
 * @param {Request} req Express request object
 * @param {Document} data Resource data (either new data or previous data depending on "isNew")
 * @param {string} resource Resource name
 * @param {string} id UUIDv4 for the resource
 * @param {string} historyId UUIDv4 for the history object
 * @param {boolean} [isNew] True if a new resource (default: true)
 * @param {object} [club] Will use club object instead of req.body to get diff if defined
 * @returns {Promise<Document>} The history document
 */
async function createNewHistory(req, data, resource, id, historyId, isNew = true, club) {
    return new History({
        id: historyId,
        resource,
        editId: id,
        time: new Date().valueOf(),
        editor: await getEditor(req),
        fields: isNew ? objectToHistoryObject(data.toObject()) : getDiff(data.toObject(), club || req.body),
    });
}

/**
 * Checks for key; All fields that ends with "id" or are "history"/"repeatEnd" will be omitted.
 * @param {string} key Key to check
 * @returns {boolean} True if is a valid key
 */
const isValidKey = (key) => !key.toLowerCase().endsWith('id') && key !== 'history' && key !== 'repeatEnd';

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
    return parsedFields.filter((f) => isValidKey(f.key));
}

/**
 * Creates a history "fields" object from a created object.
 *
 * This will compare the previous data with the current data and save all changes.
 * If you look closely, this forms a recursive function with getDiffArray and will
 * loop through all fields in the object.
 *
 * @param {object} prevData Previous data object
 * @param {object} data Data object
 * @returns {object} History fields object
 */
function getDiff(prevData, data) {
    let output = [];
    Object.entries(data).forEach(([key, value]) => {
        if (prevData[key] === value) return;
        if (!isValidKey(key)) return;
        if (Array.isArray(value)) {
            output.push(...getDiffArray(prevData[key], value, key));
            return;
        }
        if (typeof value === 'object' && value !== null) {
            const obj = getDiff(prevData[key], value);
            output.push(...obj.map((o) => ({ ...o, key: `${key}.${o.key}` })));
            return;
        }
        output.push({
            key,
            oldValue: prevData[key] || null,
            newValue: value,
        });
    });
    return output;
}

/**
 * Creates a history "fields" object from a created object.
 * This function parses two arrays and checks the diff of each object.
 * If the prevData is longer, then the output will simply display [deleted]
 * If the data is longer, then the extra data objects will be treated as new objects
 * This will compare the previous data with the current data and save all changes.
 *
 * @param {object[]} prevData Previous data object
 * @param {object[]} data Data object
 * @param {string} key The name of the key of this array
 * @returns {object} History fields object
 */
function getDiffArray(prevData, data, key) {
    const output = [];
    for (let i = 0; i < prevData.length && i < data.length; i++) {
        if (i < prevData.length && i >= data.length)
            output.push({ key: `${key}[${i}]`, oldValue: prevData[i], newValue: '[deleted]' });
        else if (i < data.length && i >= prevData.length)
            output.push({ key: `${key}[${i}]`, oldValue: null, newValue: data[i] });
        else {
            if (prevData[i] === data[i]) continue;
            if (Array.isArray(data[i])) output.push(...getDiffArray(prevData[i], data[i], `${key}[${i}]`));
            else if (typeof data[i] === 'object') {
                const obj = getDiff(prevData[i], data[i]);
                output.push(...obj.map((o) => ({ ...o, key: `${key}[${i}].${o.key}` })));
            } else
                output.push({
                    key: `${key}[${i}]`,
                    oldValue: prevData[i] || null,
                    newValue: data[i],
                });
        }
    }
    return output;
}

/**
 * Will parse the editor object into a readable string depending
 * on the stored values. Will also display "N/A" for invalid objects or values
 *
 * @param {Editor} editor The editor object
 * @returns {Promise<string>} The parsed editor to display
 */
async function parseEditor(editor) {
    if (!editor) return 'N/A';
    if (editor.id === null) return editor.ip;

    const editorRes = await User.findOne({ id: editor.id });
    if (!editorRes) return 'N/A';
    return editorRes.name;
}

module.exports = { checkEnv, sendError, newId, getIp, getEditor, createNewHistory, parseEditor };
