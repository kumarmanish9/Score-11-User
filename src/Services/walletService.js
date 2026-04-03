import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE}/wallet`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getWalletBalance = async () => {
  const response = await api.get('/balance');
  return response.data.data;
};

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data.data || [];
};

export const addMoney = async (data) => {
  const response = await api.post('/add-money', data);
  return response.data;
};

export default api;

