import axios from 'axios';

export const API_BASE = 'http://68.178.171.95:3000/api/v1';
// Comment out for local dev: http://localhost:3000/api/v1

export const createApiInstance = (axios) => {
  const axiosInstance = axios.create({
    baseURL: API_BASE,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance;
};

export default createApiInstance(axios);
