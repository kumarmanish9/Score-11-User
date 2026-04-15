import axios from "axios";

// ✅ Base URL
import { API_BASE } from "../config/api";
const API = `${API_BASE}/auth`;

// 🔐 Axios instance
const axiosInstance = axios.create({
  baseURL: API,
});

// ✅ Uses shared API config + token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ================= AUTH APIs ================= //

// ✅ LOGIN
export const loginUser = (data) => {
  return axiosInstance.post("/login", data);
};

// ✅ REGISTER
export const registerUser = (data) => {
  return axiosInstance.post("/register", data);
};

// ✅ LOGOUT
export const logoutUser = () => {
  return axiosInstance.post("/logout"); 
};

// ================= PASSWORD FLOW ================= //

// ✅ SEND OTP
export const sendOtp = (data) => {
  return axiosInstance.post("/send-otp", data);
};

// ✅ VERIFY OTP
export const verifyOtp = (data) => {
  return axiosInstance.post("/verify-otp", data);
};

// ✅ RESET PASSWORD
export const resetPassword = (data) => {
  return axiosInstance.post("/reset-password", data);
};

// ================= USER ================= //

// ✅ GET CURRENT USER
export const getCurrentUser = () => {
  return axiosInstance.get("/me");
};

// ✅ CHANGE PASSWORD (logged-in user)
export const changePassword = (data) => {
  return axiosInstance.post("/change-password", data);
};

// ✅ UPLOAD PROFILE AVATAR
import api from "../config/api.js";
export const uploadAvatar = (formData) => {
  return api.post("/users/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
