import axios from "axios";

const localhost = "http://localhost:5006"

export const getRequest = (url, options) => {
    const config = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'credentials': 'include'
        },
        data: options,
        url: `${localhost}${url}`,
        withCredentials: true
    };
    return axios(config);
};

export const getIntraRequest = (url, options) => {
    const config = {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'credentials': 'include',
            'withCredentials' : 'true'
        },
        data: options,
        url: url,
    };
    return axios(config);
};

export const getGetRequest = (url, options) => {
    const config = {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'credentials': 'include',
            'withCredentials' : 'true'
        },
        data: options,
        url: `${localhost}${url}`,
    };
    return axios(config);
};

export const putRequest = (url, content) => axios.put(`${localhost}${url}`, {...content});