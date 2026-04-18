import axios from "axios";
import { API_BASE } from "../config/api";

// ✅ Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/teams`,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =============================
// ✅ TEAM APIs
// =============================

// 🚫 REMOVE this (no such API in backend)
// export const getTeams = async () => {
//   const response = await api.get('/');
//   return response.data.data || [];
// };

// ✅ Get logged-in user's teams (FIXED: correct endpoint /team/teams)
export const getUserTeams = async () => {
  const response = await api.get('/team/teams');
  return response.data?.data || [];
};

// ✅ Get all active teams (admin-like dropdown) - FIXED base path
export const getAllTeams = async (params = {}) => {
  const response = await api.get('/list', { params });
  return response.data?.data?.teams || response.data?.data || [];
};



// ✅ Create new team
export const createTeam = async (data) => {
  const response = await api.post("/", data);
  return response.data;
};

// ✅ Get team by ID (protected)
export const getTeamById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data?.data;
};

// =============================
// 🆕 ADDITIONAL APIs (IMPORTANT)
// =============================

// 🔍 Search teams (public)
export const searchTeams = async (query) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data?.data || [];
};

// 🌍 Get public team
export const getPublicTeam = async (id) => {
  const response = await api.get(`/public/${id}`);
  return response.data?.data;
};

// ➕ Add player to team
export const addPlayerToTeam = async (teamId, playerId) => {
  const response = await api.post(`/${teamId}/players`, {
    playerId,
  });
  return response.data;
};

// 👑 Set captain
export const setCaptain = async (teamId, playerId) => {
  const response = await api.post(`/${teamId}/captain`, {
    playerId,
  });
  return response.data;
};

// 🖼 Upload team logo
export const uploadTeamLogo = async (teamId, formData) => {
  const response = await api.post(`/${teamId}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 🗑 Delete team (soft delete)
export const deleteTeam = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// 🔄 Update team
export const updateTeam = async (id, data) => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

export default api;
