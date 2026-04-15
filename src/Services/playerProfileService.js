import api from "../config/api";

// ================= API FUNCTIONS =================

// 👉 Get my profile (fixed to /users/me)
export const getMyProfile = () => {
  return api.get("/users/me");
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

// 👉 Get profile by ID (public)
export const getProfileById = (id) => {
  return api.get(`/playerProfile/${id}`);
};

// 👉 Get verified profiles (paginated)
export const getVerifiedProfiles = (page = 1, limit = 10) => {
  return api.get(`/playerProfile/verified`, { params: { page, limit } });
};

// 👉 Link profile to player account (Profile Owner)
export const linkPlayer = (id, data) => {
  return api.post(`/playerProfile/${id}/link-player`, data);
};

// 👉 Delete profile (Profile Owner / Admin)
export const deleteProfile = (id) => {
  return api.delete(`/playerProfile/${id}`);
};

// 👉 Update my profile
export const updateMyProfile = (data) => {
  return api.put("/users/me", data);
};

// 👉 Upload profile avatar
export const uploadProfileAvatar = (formData) => {
  return api.post("/users/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
