import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getMonthlyBudget = (month) =>
  api.get('/monthlyBudget', {
    params: { month },
  });

export const createMonthlyBudget = (data) => api.post('/monthlyBudget', data);

export const updateMonthlyBudget = (id, data) =>
  api.put(`/monthlyBudget/${id}`, data);
