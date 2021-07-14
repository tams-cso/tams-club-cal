import { RESET_DATA_STATE, SET_EVENT_LIST, SET_VOLUNTEERING_LIST, SET_CLUB_LIST, SET_TOKEN } from './actionTypes';

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
