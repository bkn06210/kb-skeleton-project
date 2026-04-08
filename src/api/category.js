import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getIncomeCategory = () => api.get('/incomeCategory');
export const getExpenseCategory = () => api.get('/expenseCategory');
