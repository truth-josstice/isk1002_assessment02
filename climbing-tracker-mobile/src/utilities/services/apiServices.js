import axios from "axios";

// Set up const variable for API URL using process.env (Expo does not use import.meta like a React web project does)
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:3000";

// Set up instance of axios with customised content type, timeout (8000 more suited to mobile applications), and dynamic API_URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 8000,
    headers: {"Content-Type": "application/json"},
});

// Authorisation token interceptor, runs on all routes with securely stored token
/*
api.interceptors.request.use((config) => {
    const token = await EncryptedStorage.getItemAsync('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    })
    return config;
*/

export default api;