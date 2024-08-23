import axios from "axios";
import { VITE_API_URL } from "../config";

const instance = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});

export default instance;
