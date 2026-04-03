import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE}/contests`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getContests = async () => {
  const response = await api.get('/');
  return response.data.data || [];
};

export const getContestById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

export const joinContest = async (id) => {
  const response = await api.post(`/${id}/join`);
  return response.data;
};

export default api;

