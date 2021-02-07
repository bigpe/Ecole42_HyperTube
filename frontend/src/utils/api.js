import axios from "axios";

<<<<<<< HEAD
const localhost = location.origin;
=======
const localhost = window.location.origin
>>>>>>> 6ce3cf968bce0a2caadbee12ebce44c80c0a63d0

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