import { USER_LOG_IN } from "../constants/actions/user"
import { USER_LOG_OUT } from "../constants/actions/user"


export const userLogIn = () =>({ type: USER_LOG_IN });
export const userLogOut = () =>({ type: USER_LOG_OUT });