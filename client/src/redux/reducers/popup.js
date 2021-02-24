import {
    RESET_POPUP_STATE,
    SET_EDIT,
    SET_ID,
    SET_NEW,
    SET_OPEN,
    SET_DELETED,
    SET_TYPE,
    SET_MOBILE_DROPDOWN,
    OPEN_POPUP,
} from '../actionTypes';

const initialState = {
    open: false,
    edit: false,
    new: false,
    id: '',
    deleted: false,
    type: '', // events | volunteering | clubs
    mobileDropdown: false,
};

export default function popup(state = initialState, action) {
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
        case SET_EDIT: {
            const { edit } = action.payload;
            return {
                ...state,
                edit,
            };
        }
        case SET_NEW: {
            const { newPopup } = action.payload;
            return {
                ...state,
                new: newPopup,
            };
        }
        case SET_ID: {
            const { id } = action.payload;
            return {
                ...state,
                id,
            };
        }
        case SET_DELETED: {
            const { deleted } = action.payload;
            return {
                ...state,
                deleted,
            };
        }
        case SET_TYPE: {
            const { type } = action.payload;
            return {
                ...state,
                type,
            };
        }
        case SET_MOBILE_DROPDOWN: {
            const { open } = action.payload;
            return {
                ...state,
                mobileDropdown: open,
            };
        }
        case OPEN_POPUP: {
            const { id, type } = action.payload;
            return {
                ...state,
                id,
                type,
                open: true,
            };
        }
        default:
            return state;
    }
}
