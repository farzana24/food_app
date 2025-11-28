import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 and refresh token logic here if needed
        // For now, just reject
        return Promise.reject(error);
    }
);
