import {
    RESET_DATA_STATE,
    SET_CLUB_LIST,
    SET_EVENT_LIST,
    SET_VOLUNTEERING_LIST,
    UPDATE_EVENT,
    UPDATE_VOLUNTEERING,
} from '../actionTypes';

const initialState = {
    eventList: null,
    volunteeringList: null,
    clubList: null,
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
        case UPDATE_EVENT: {
            const { id, event } = action.payload;
            var eventList = [...state.eventList];
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i].objId === id) {
                    eventList[i] = { _id: eventList[i]._id, ...event };
                    break;
                }
            }
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
        case UPDATE_VOLUNTEERING: {
            const { id, vol } = action.payload;
            var volunteeringList = [...state.volunteeringList];
            for (var i = 0; i < volunteeringList.length; i++) {
                if (volunteeringList[i]._id === id) {
                    volunteeringList[i] = { ...volunteeringList[i], ...vol };
                    break;
                }
            }
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
        default:
            return state;
    }
}
