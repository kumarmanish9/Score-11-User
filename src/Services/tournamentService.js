import axios from 'axios';
import { API_BASE } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE}/tournaments`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all tournaments
export const getTournaments = async () => {
  const response = await api.get('/');
  return response.data.data || [];
};

// Get tournament by ID
export const getTournamentById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data.data;
};

// Join tournament
export const joinTournament = async (id) => {
  const response = api.post(`/${id}/join`);
  return response.data;
};

// Get user tournaments
export const getUserTournaments = async () => {
  const response = api.get('/me');
  return response.data.data || [];
};

export default api;

