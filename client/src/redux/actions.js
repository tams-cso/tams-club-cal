import {
    RESET_DATA_STATE,
    SET_EVENT_LIST,
    SET_VOLUNTEERING_LIST,
    RESET_POPUP_STATE,
    SET_OPEN,
    SET_EDIT,
    SET_ID,
    UPDATE_VOLUNTEERING,
    SET_CLUB_LIST,
    UPDATE_EVENT,
    UPDATE_CLUB,
    SET_NEW,
    ADD_VOLUNTEERING,
    ADD_CLUB,
    DELETE_CLUB,
    SET_DELETED,
    SET_TYPE,
    ADD_EVENT,
    SET_MOBILE_DROPDOWN,
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

export const setPopupNew = (newPopup) => ({
    type: SET_NEW,
    payload: { newPopup },
});

export const setPopupId = (id) => ({
    type: SET_ID,
    payload: { id },
});

export const updateVolunteering = (id, vol) => ({
    type: UPDATE_VOLUNTEERING,
    payload: { id, vol },
});

export const setClubList = (clubList) => ({
    type: SET_CLUB_LIST,
    payload: { clubList },
});

export const updateEvent = (id, event) => ({
    type: UPDATE_EVENT,
    payload: { id, event },
});

export const updateClub = (id, club) => ({
    type: UPDATE_CLUB,
    payload: { id, club },
});

export const addVolunteering = (vol) => ({
    type: ADD_VOLUNTEERING,
    payload: { vol },
});

export const addClub = (club) => ({
    type: ADD_CLUB,
    payload: { club },
});

export const deleteSavedClub = (id) => ({
    type: DELETE_CLUB,
    payload: { id },
});

export const setPopupDeleted = (deleted) => ({
    type: SET_DELETED,
    payload: { deleted },
});

export const setPopupType = (type) => ({
    type: SET_TYPE,
    payload: { type },
});

export const addEvent = (event) => ({
    type: ADD_EVENT,
    payload: { event },
});

export const setMobileDropdown = (open) => ({
    type: SET_MOBILE_DROPDOWN,
    payload: { open },
});

export const openPopup = (id, type) => ({
    type: OPEN_POPUP,
    payload: { id, type },
});
