import { REQUEST_START } from "../constants/actions/common";
import { USER_AUTH_STATUS, USER_LOG_IN } from "../constants/actions/user";

const initialState = {
    auth: true,
    login: '',
    langv: 'ru',
}

export const user = (state= initialState, action) => {
    switch (action.type) {
        case REQUEST_START:
            return {...state, loading: true};
        case USER_AUTH_STATUS:
            return {...state, auth: action.payload}
        case USER_LOG_IN:
            return {...state, auth: true}
        default:
            return state;
    }
}

export default user;