import api from "../config/api";

const BASE_URL = "/matches";

// ✅ Get all matches
export const getMatches = async (type) => {
  const res = await api.get(`${BASE_URL}/${type}`);
  return res.data?.data;
};

// ✅ Get match details
export const getMatchDetails = async (id) => {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data?.data;
};