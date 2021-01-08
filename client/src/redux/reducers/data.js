import { RESET_STATE, SET_EVENT_LIST, SET_VOLUNTEERING_LIST } from '../actionTypes';

const initialState = {
    eventList: null,
    volList: null,
};

export default function data(state = initialState, action) {
    switch (action.type) {
        case RESET_STATE: {
            return initialState;
        }
        case SET_EVENT_LIST: {
            const { eventList } = action.payload;
            return {
                ...state,
                eventList,
            };
        }
        case SET_VOLUNTEERING_LIST: {
            const { volunteeringList } = action.payload;
            return {
                ...state,
                volunteeringList,
            };
        }
        default:
            return state;
    }
}
