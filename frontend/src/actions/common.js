import { SET_MSG } from "../constants/actions/common"

export const setMsg = (msg) => ({
    type: SET_MSG,
    payload: msg
});

export const addMsg = (msg) => (dispatch) => {
    dispatch(setMsg(msg));
};