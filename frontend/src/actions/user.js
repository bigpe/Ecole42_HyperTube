import { USER_LOG_IN, USER_LOG_OUT, USER_SET_DATA } from "../constants/actions/user"

export const addUserData = (data) => ({
    type: USER_SET_DATA,
    payload: data
});

export const setUserData = (data) => (dispatch) => {
    dispatch(addUserData(data));
};

export const userLogIn = () =>({ type: USER_LOG_IN });
export const userLogOut = () =>({ type: USER_LOG_OUT });

