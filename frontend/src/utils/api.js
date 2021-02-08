import axios from "axios";

const localhost = location.origin;

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
export const getPutRequest = (url, options) => {
    const config = {
        method: 'PUT',
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

export const getGetRequest = (url) => {
    const config = {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'credentials': 'include',
            'withCredentials' : 'true'
        },
        url: `${localhost}${url}`,
    };
    return axios(config);
};

export const getImgRequest = (url, options) => {
    const config = {
        method: 'POST',
        headers: {
            'content-type' : 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'credentials': 'include'
        },
        data: options,
        url: `${localhost}${url}`,
        withCredentials: true
    };
    return axios(config);
};

export const putRequest = (url, content) => axios.put(`${localhost}${url}`, {...content});