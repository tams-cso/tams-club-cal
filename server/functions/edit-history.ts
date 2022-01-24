import { Request } from 'express';
import { Document } from 'mongoose';
import History from '../models/history';
import User from '../models/user';
import type { Editor, Field, ClubObject } from './types';
import { getIp } from './util';

/**
 * Creates the editor object, where it will first save the ID, and if not avaliable, then it
 * will save the ip address of the client that edited the resource.
 *
 * @param {Request} req Express request object
 * @returns {Promise<object>} Returns { id, ip } with only one of them null, where id takes priority
 */
async function getEditor(req: Request): Promise<Editor> {
    const authorization = req.headers['authorization'];
    const token = authorization ? await User.findOne({ token: authorization.substring(7) }) : null;
    if (token) return { id: token.id, ip: null };
    else return { id: null, ip: getIp(req) };
}

/**
 * Creates a history object given the data of the newly created resource.
 * If it's a new history entry (default), it will simply convert the fields of the data
 * passed in to a key/value pair, or else it will run the diff between the
 * previous and new data (in req.body).
 *
 * @param req Express request object
 * @param data Resource data (either new data or previous data depending on "isNew")
 * @param resource Resource name
 * @param id UUIDv4 for the resource
 * @param historyId UUIDv4 for the history object
 * @param isNew True if a new resource (default: true)
 * @param club Will use club object instead of req.body to get diff if defined
 */
export async function createHistory(
    req: Request,
    data: object,
    resource: string,
    id: string,
    historyId: string,
    isNew: boolean = true,
    club?: ClubObject
): Promise<Document> {
    return new History({
        id: historyId,
        resource,
        editId: id,
        time: new Date().valueOf(),
        editor: await getEditor(req),
        fields: isNew ? objectToHistoryObject(data) : getDiff(data, club || req.body),
    });
}

/**
 * Checks for key; All fields that ends with "id" or are "history"/"repeatEnd" will be omitted.
 */
const isValidKey = (key: string) => !key.toLowerCase().endsWith('id') && key !== 'history' && key !== 'repeatEnd';

// Define types to be used for history object manipulation
type HistoryData = object | HistoryArrayData;
type HistoryArrayData = (HistoryData | HistoryArrayData)[];

/**
 * Creates a history "fields" object from a created object.
 * All fields that start with _ or is "id"/"history" will be omitted.
 * This will simply map all key value pairs to "keys" and "newValue".
 */
function objectToHistoryObject(data: HistoryData): Field[] {
    const parsedFields = Object.entries(data).map(([key, value]) => ({
        key,
        oldValue: null,
        newValue: value,
    }));
    return parsedFields.filter((f) => isValidKey(f.key));
}

/**
 * This will compare the previous data with the current data and save all changes.
 * If you look closely, this forms a recursive function with getDiffArray and will
 * loop through all fields in the object.
 */
function getDiff(prevData: HistoryData, data: HistoryData): Field[] {
    const output: Field[] = [];
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
function getDiffArray(prevData: HistoryArrayData, data: HistoryArrayData, key: string): Field[] {
    const output: Field[] = [];
    for (let i = 0; i < prevData.length && i < data.length; i++) {
        if (i < prevData.length && i >= data.length)
            output.push({ key: `${key}[${i}]`, oldValue: prevData[i], newValue: '[deleted]' });
        else if (i < data.length && i >= prevData.length)
            output.push({ key: `${key}[${i}]`, oldValue: null, newValue: data[i] });
        else {
            if (prevData[i] === data[i]) continue;
            if (Array.isArray(data[i]))
                output.push(
                    ...getDiffArray(prevData[i] as HistoryArrayData, data[i] as HistoryArrayData, `${key}[${i}]`)
                );
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
 */
export async function parseEditor(editor: Editor): Promise<string> {
    if (!editor) return 'N/A';
    if (editor.id === null) return editor.ip;

    const editorRes = await User.findOne({ id: editor.id });
    if (!editorRes) return 'N/A';
    return editorRes.name;
}
