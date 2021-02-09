import { SET_LANG, SET_MSG } from "../constants/actions/common"

export const setMsg = (msg) => ({
    type: SET_MSG,
    payload: msg
});
export const setLang = (lang) => ({
    type: SET_LANG,
    payload: lang
});
