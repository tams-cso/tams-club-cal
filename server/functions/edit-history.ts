import { Request } from 'express';
import { Document } from 'mongoose';
import History from '../models/history';

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
 * @param editorId UUIDv4 for the ID of the user that edited the event
 * @param historyId UUIDv4 for the history object
 * @param isNew True if a new resource (default: true)
 * @param newData Will use resource object instead of req.body to get diff if defined
 */
export function createHistory(
    req: Request,
    data: object,
    resource: string,
    id: string,
    editorId: string,
    historyId: string,
    isNew: boolean = true,
    newData?: object,
): Document {
    // Make sure editor is valid user
    if (!editorId) return null;

    // Generate fields object
    const fields = isNew ? objectToHistoryObject(data) : getDiff(data, newData || req.body);

    // Return null if empty edit
    if (fields.length === 0) return null;

    // Return history object
    return new History({
        id: historyId,
        resource,
        resourceId: id,
        time: new Date().valueOf(),
        editorId,
        fields,
    });
}

/**
 * Checks for key; All fields that ends with "id" or are "history"/"repeatEnd" will be omitted.
 */
const isValidKey = (key: string) =>
    !key.toLowerCase().endsWith('id') && !key.startsWith('history') && key !== 'repeatEnd';

// Define types to be used for history object manipulation
type HistoryData = object | HistoryArrayData;
type HistoryArrayData = (HistoryData | HistoryArrayData)[];

/**
 * Creates a history "fields" object from a created object.
 * All fields that start with _ or is "id"/"history" will be omitted.
 * This will simply map all key value pairs to "keys" and "newValue".
 * All nested objects and arrays will also be recursed through
 */
function objectToHistoryObject(data: HistoryData, prevKey: string = ''): Field[] {
    const parsedFields = [];
    const pk = prevKey ? `${prevKey}.` : '';
    Object.entries(data).forEach(([key, value]) => {
        const keyStr = `${pk}${key}`;
        if (value === null || value === undefined) parsedFields.push({ key: keyStr, oldValue: null, newValue: null });
        else if (Array.isArray(value)) parsedFields.push(...objectArrToHistoryObject(value, keyStr));
        else if (typeof value === 'object') parsedFields.push(...objectToHistoryObject(value, keyStr));
        else parsedFields.push({ key: keyStr, oldValue: null, newValue: value });
    });
    return parsedFields.filter((f) => isValidKey(f.key));
}

/**
 * Same as objectToHistoryObject function except iterates through array
 * There is no case for nested arrays (thank god)
 */
function objectArrToHistoryObject(data: HistoryArrayData, prevKey: string = ''): Field[] {
    const parsedFields = [];
    data.forEach((d, i) => {
        const key = `${prevKey}[${i}]`;
        if (typeof d === 'object') parsedFields.push(...objectToHistoryObject(d, key));
        else parsedFields.push({ key, oldValue: null, newValue: d });
    });
    return parsedFields;
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
