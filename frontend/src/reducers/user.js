import { REQUEST_START } from "../constants/actions/common";
import { USER_AUTH_STATUS, USER_LOG_IN, USER_LOG_OUT, USER_SET_DATA} from "../constants/actions/user";

const initialState = {
    auth: false,
    login: '',
    firstName : '', 
    lastName: '', 
    email: '',
    userPhoto: '',
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
        case USER_SET_DATA:
            return {...state, ...action.payload}
        case USER_LOG_OUT:
                return {...state, ...initialState}
        default:
            return state;
    }
}

export default user;