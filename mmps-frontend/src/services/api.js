import axios from 'axios';

// The base URL switches between the environment variable (for production)
// and localhost (for local development).
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mmps-backend-94wu.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically add the token to the Authorization header if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
