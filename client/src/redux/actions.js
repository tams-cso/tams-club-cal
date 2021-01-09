import {
    RESET_DATA_STATE,
    SET_EVENT_LIST,
    SET_VOLUNTEERING_LIST,
    RESET_POPUP_STATE,
    SET_OPEN,
    SET_EDIT,
    SET_ID,
} from './actionTypes';

export const resetDataState = () => ({
    type: RESET_DATA_STATE,
});

export const setEventList = (eventList) => ({
    type: SET_EVENT_LIST,
    payload: { eventList },
});

export const setVolunteeringList = (volunteeringList) => ({
    type: SET_VOLUNTEERING_LIST,
    payload: { volunteeringList },
});

export const resetPopupState = () => ({
    type: RESET_POPUP_STATE,
});

export const setPopupOpen = (open) => ({
    type: SET_OPEN,
    payload: { open },
});

export const setPopupEdit = (edit) => ({
    type: SET_EDIT,
    payload: { edit },
});

export const setPopupId = (id) => ({
    type: SET_ID,
    payload: { id },
});
