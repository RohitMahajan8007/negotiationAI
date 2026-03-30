import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const startNegotiation = (userId, productId) => api.post('/negotiation/start', { userId, productId });
export const sendOffer = (payload) => api.post('/negotiation/offer', payload);
export const resetNegotiation = (userId, productId) => api.post('/negotiation/reset', { userId, productId });
export const completePurchase = (userId, productId, amount) => api.post('/negotiation/purchase', { userId, productId, amount });
export const getLeaderboard = () => api.get('/negotiation/leaderboard');
export const getHistory = (userId) => api.get(`/negotiation/history/${userId}`);

export default api;
