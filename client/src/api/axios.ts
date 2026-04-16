import axios from 'axios';

const api = axios.create({
    // Vite uses import.meta.env instead of process.env
    baseURL: import.meta.env.VITE_API_URL,
});

// 1. The Request Interceptor (You already had this!)
// Runs before every single OUTGOING request to attach the token
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

// 2. The Response Interceptor (The new addition!)
// Runs on every single INCOMING response to catch expired tokens
api.interceptors.response.use(
    (response) => {
        // If the response is good, just pass it through
        return response;
    },
    (error) => {
        // If the backend yells "UNAUTHORIZED!" (Token expired or invalid)
        if (error.response?.status === 401 || error.response?.status === 403) {

            // 1. Nuke the dead token
            localStorage.removeItem('token');

            // 2. Force the browser back to the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;