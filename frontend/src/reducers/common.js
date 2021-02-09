import { REQUEST_START, SET_LANG } from "../constants/actions/common";

const initialState = {
    msg: '',
    langv: 'ru',
}

export const user = (state= initialState, action) => {
    switch (action.type) {
        case SET_LANG:
            return {...state, langv: action.payload === "ru" ? "ru" : "eng"};
        default:
            return state;
    }
}

export default user;