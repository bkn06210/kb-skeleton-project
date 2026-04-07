import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const getPeriodicExpense = () => api.get('/periodicExpense');
export const addPeriodicExpense = (data) => api.post('/periodicExpense', data);
export const deletePeriodicExpense = (id) =>
  api.delete(`/periodicExpense/${id}`);
