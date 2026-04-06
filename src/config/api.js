import axios from "axios";

export const API_BASE = "http://68.178.171.95:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;