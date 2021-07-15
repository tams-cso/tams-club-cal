import { OPEN_POPUP, RESET_POPUP_STATE, SET_MESSAGE, SET_OPEN, SET_SEVERITY } from '../actionTypes';

const initialState = {
    open: false,
    message: '',
    severity: 0, // 0 - none, 1 - info, 2 - success, 3 - warning, 4 - error
};

export default function data(state = initialState, action) {
    switch (action.type) {
        case RESET_POPUP_STATE: {
            return initialState;
        }
        case SET_OPEN: {
            const { open } = action.payload;
            return {
                ...state,
                open,
            };
        }
        case SET_MESSAGE: {
            const { message } = action.payload;
            return {
                ...state,
                message,
            };
        }
        case SET_SEVERITY: {
            const { severity } = action.payload;
            return {
                ...state,
                severity,
            };
        }
        case OPEN_POPUP: {
            const { message, severity } = action.payload;
            return {
                ...state,
                open: true,
                message,
                severity,
            };
        }
        default:
            return state;
    }
}
