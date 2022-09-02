import axios from "axios";
import config from "./Config.json";

const axiosInstance = axios.create({
    baseURL: config.baseUrl
});

axiosInstance.interceptors.request.use(function (config) {
    //console.log(config);
    return config;
}, function (error) {
    return Promise.reject(error);
});


axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status == 401) {
        alert('Session expired. Redirecting to login page');
        window.location.href = '/';
    }
    return Promise.reject(error);
});

export default  axiosInstance;