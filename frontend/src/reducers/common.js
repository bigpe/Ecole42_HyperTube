import { REQUEST_START } from "../constants/actions/common";
import { SET_MSG } from "../constants/actions/common";

const initialState = {
    msg: '',
    langv: 'ru',
}

export const user = (state= initialState, action) => {
    switch (action.type) {
        case REQUEST_START:
            return {...state, loading: true};
        case SET_MSG:
            return {...state, ...payload}
        default:
            return state;
    }
}

export default user;