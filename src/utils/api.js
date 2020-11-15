import axios from "axios";

const localhost = "http://192.168.0.3:5006"

export const getRequest = (url, options) => axios.post(`${localhost}${url}`,
    { ...options});