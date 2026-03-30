import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

export default api;
