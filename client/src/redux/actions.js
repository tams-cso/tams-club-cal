import { RESET_STATE, SET_EVENT_LIST } from './actionTypes';

export const resetState = () => ({
    type: RESET_STATE,
});

export const setEventList = (eventList) => ({
    type: SET_EVENT_LIST,
    payload: { eventList },
});
