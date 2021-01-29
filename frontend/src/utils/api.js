import axios from "axios";

const localhost = "http://0.0.0.0:5006"

export const getRequest = (url, options) => axios.post(`${localhost}${url}`, { ...options});
export const putRequest = (url, content) => axios.put(`${localhost}${url}`, {...content});