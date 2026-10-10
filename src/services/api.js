import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Users ----
export const createUser = (data) => api.post('/users', data).then((r) => r.data);
export const getUser = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const getUserProgress = (id) => api.get(`/users/${id}/progress`).then((r) => r.data);
export const listUsers = () => api.get('/users').then((r) => r.data);

// ---- Lessons ----
export const listLessons = (category) =>
  api.get('/lessons', { params: category ? { category } : {} }).then((r) => r.data);
export const getLesson = (id) => api.get(`/lessons/${id}`).then((r) => r.data);
export const completeLesson = (payload) =>
  api.post('/lessons/complete', payload).then((r) => r.data);

// ---- Shop (do'kon katalogi + xaridlar) ----
export const getShop = () => api.get('/shop').then((r) => r.data);
export const getUserPurchases = (id) => api.get(`/users/${id}/purchases`).then((r) => r.data);
export const purchaseItem = (id, itemKey) =>
  api.post(`/users/${id}/purchases`, { item_key: itemKey }).then((r) => r.data);

// ---- Games ----
export const getGames = () => api.get('/games').then((r) => r.data);
export const getGameProgress = (userId) =>
  api.get('/games/progress', { params: { user_id: userId } }).then((r) => r.data);
export const completeGame = (payload) =>
  api.post('/games/complete', payload).then((r) => r.data);

export default api;