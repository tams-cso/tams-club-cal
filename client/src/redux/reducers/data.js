import { RESET_DATA_STATE, SET_CLUB_LIST, SET_EVENT_LIST, SET_VOLUNTEERING_LIST, SET_TOKEN } from '../actionTypes';

const initialState = {
    eventList: null,
    volunteeringList: null,
    clubList: null,
    token: null,
};

export default function data(state = initialState, action) {
    switch (action.type) {
        case RESET_DATA_STATE: {
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
        case SET_CLUB_LIST: {
            const { clubList } = action.payload;
            return {
                ...state,
                clubList,
            };
        }
        case SET_TOKEN: {
            const { token } = action.payload;
            return {
                ...state,
                token,
            };
        }
        default:
            return state;
    }
}
