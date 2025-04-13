import axios from 'axios';
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.0.2.2:8000"; // Android Emulator
// const BASE_URL = "http://localhost:8000"; // iOS Simulator
// const BASE_URL = "http://192.168.0.108:8000" // Local Network

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

axios.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axios;
export { BASE_URL };