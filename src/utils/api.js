import axios from "axios";

const localhost = "http://127.0.0.1:5000"

export const getRequest = (url, options) => axios.post(`${localhost}${url}`,
    { ...options});