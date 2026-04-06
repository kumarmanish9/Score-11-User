import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE}/teams`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTeams = async () => {
  const response = await api.get('/');
  return response.data.data || [];
};

export const getUserTeams = async () => {
  const response = await api.get('/my-teams');
  return response.data.data || [];
};

export const createTeam = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

export const getTeamById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

export default api;

