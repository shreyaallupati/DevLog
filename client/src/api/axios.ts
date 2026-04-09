import axios from 'axios';

const api = axios.create({
// Vite uses import.meta.env instead of process.env
    baseURL: import.meta.env.VITE_API_URL,
});

// The Interceptor: Runs before every single request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;