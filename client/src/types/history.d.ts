/** An object containing the information for a single edit to a specific resource */
interface History {
    /** The unique UUIDv4 for the history object */
    id: string;

    /** Resource name of the history */
    resource: Resource;

    /** The ID of the original resource */
    resourceId: string;

    /** The time in UTC milliseconds that this edit was made */
    time: number;

    /** The editor of this specific resource */
    editorId: string;

    /** List of fields that were edited */
    fields: Field[];
}

/** An object containing the information to display a certain edit in the history list */
interface HistoryData {
    /** Name of the resource that is edited */
    name: string;

    /** Name of the editor of the resource */
    editor: string;
}

/** The data that is passed when GET /history is called */
interface HistoryListData {
    /** History object list */
    historyList: History[];

    /** Display data list */
    dataList: HistoryData[];
}

/** The data that is passed when GET /history/[resource]/[id] is called */
interface HistoryItemData {
    /** List of history items */
    history: History[];

    /** Name of the resource */
    name: string;

    /** List of editors' names */
    editorList: string[];
}

/** An object containing a specific edited field */
interface Field {
    /** The key for the field (eg. 'name') */
    key: string;

    /** The old value of the field */
    oldValue: object | string;

    /** The new value of the field */
    newValue: object | string;
}
