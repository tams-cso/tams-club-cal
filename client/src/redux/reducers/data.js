import { RESET_STATE, SET_EVENT_LIST } from "../actionTypes";

const initialState = {
    eventList: null,
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
        default:
            return state;
    }
}
