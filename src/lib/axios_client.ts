import axios from "axios";
import { getAuthenticationToken } from "./authentication";
import { apiUrl } from "../constants/app_constants";

const axiosHttp = axios.create({
    baseURL: apiUrl,
});

axiosHttp.interceptors.request.use((config) => {
    const authToken = getAuthenticationToken();
    if (authToken) {
        config.headers['authorization'] = authToken;
    }
    return config;
},(error) => {
    return Promise.reject(error);
})


export default axiosHttp