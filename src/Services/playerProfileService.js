import axios from "axios";

const BASE_URL = "http://68.178.171.95:3000/api/v1";

// 🔑 Token (stored after login)
const getToken = () => localStorage.getItem("token");

// 🔹 Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Add token in headers
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= API FUNCTIONS =================

// 👉 Get my profile
export const getMyProfile = () => {
  return api.get("/playerProfile/me");
};

// 👉 Create profile
export const createProfile = (data) => {
  return api.post("/playerProfile", data);
};

// 👉 Update profile
export const updateProfile = (id, data) => {
  return api.put(`/playerProfile/${id}`, data);
};

// 👉 Upload stats
export const uploadStats = (id, data) => {
  return api.post(`/playerProfile/${id}/stats`, data);
};

// 👉 Update performance
export const updatePerformance = (id, data) => {
  return api.post(`/playerProfile/${id}/performance`, data);
};