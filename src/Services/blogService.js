import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE}/blogs`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBlogs = async () => {
  const response = await api.get('/');
  return response.data.data || [];
};

export const getBlogById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

export default api;

