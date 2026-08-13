import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL;

export const apiClient = axios.create({
    baseURL: `${baseURL}/api`,
    timeout: 5000
});