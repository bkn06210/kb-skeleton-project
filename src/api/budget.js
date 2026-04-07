import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getBudget = (params = {}) => api.get('/budget', { params });
export const getBudgetById = (id) => api.get(`/budget/${id}`);
export const addBudget = (data) => api.post('/budget', data);
export const updateBudget = (id, data) => api.put(`/budget/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budget/${id}`);
