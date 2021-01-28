import {
    ADD_CLUB,
    ADD_EVENT,
    ADD_VOLUNTEERING,
    DELETE_CLUB,
    RESET_DATA_STATE,
    SET_CLUB_LIST,
    SET_EVENT_LIST,
    SET_VOLUNTEERING_LIST,
    UPDATE_CLUB,
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
        case ADD_EVENT: {
            if (state.eventList === null) return state;

            const { event } = action.payload;
            var eventList = [...state.eventList];
            eventList.push(event);
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
        case UPDATE_CLUB: {
            const { id, club } = action.payload;
            var clubList = [...state.clubList];
            for (var i = 0; i < clubList.length; i++) {
                if (clubList[i].objId === id) {
                    clubList[i] = { _id: clubList[i]._id, ...club };
                    break;
                }
            }
            return {
                ...state,
                clubList,
            };
        }
        case ADD_VOLUNTEERING: {
            const { vol } = action.payload;
            var volunteeringList = [...state.volunteeringList];
            volunteeringList.push(vol);
            return {
                ...state,
                volunteeringList,
            };
        }
        case ADD_CLUB: {
            const { club } = action.payload;
            var clubList = [...state.clubList];
            clubList.push(club);
            return {
                ...state,
                clubList,
            };
        }
        case DELETE_CLUB: {
            const { id } = action.payload;
            var clubList = [...state.clubList];
            for (var i = 0; i < clubList.length; i++) {
                if (clubList[i].objId === id) {
                    clubList.splice(i, 1);
                    break;
                }
            }
            return {
                ...state,
                clubList,
            };
        }
        default:
            return state;
    }
}
