import axios from "axios";

const API = "http://68.178.171.95:3000/api/v1";

// 🔐 Create axios instance (best practice)
const axiosInstance = axios.create({
  baseURL: API,
});

// 🔥 Add token automatically in every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// LOGIN API
export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

// REGISTER API
export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

// ✅ LOGOUT API
export const logoutUser = () => {
  return axiosInstance.post("/auth/logout");
};