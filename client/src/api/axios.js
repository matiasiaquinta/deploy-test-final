import axios from "axios";
import { VITE_API_URL } from "../config";

const instance = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
