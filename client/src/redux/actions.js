import {
    RESET_DATA_STATE,
    SET_EVENT_LIST,
    SET_VOLUNTEERING_LIST,
    SET_CLUB_LIST,
    SET_TOKEN,
    SET_OPEN,
    SET_MESSAGE,
    SET_SEVERITY,
    OPEN_POPUP,
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

export const setClubList = (clubList) => ({
    type: SET_CLUB_LIST,
    payload: { clubList },
});

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: { token },
});

export const setPopupOpen = (open) => ({
    type: SET_OPEN,
    payload: { open },
});

export const setPopupMessage = (message) => ({
    type: SET_MESSAGE,
    payload: { message },
});

export const setPopupSeverity = (severity) => ({
    type: SET_SEVERITY,
    payload: { severity },
});

export const openPopup = (message, severity) => ({
    type: OPEN_POPUP,
    payload: { message, severity },
});
