import axios from "axios";
import { VITE_API_URL } from "../config";

const token = localStorage.getItem("token");

const instance = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de que el token se incluya en los encabezados
    },
});

export default instance;
