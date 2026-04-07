import api from "../config/api";

const BASE_URL = "/matches";

// ✅ Get all matches
export const getMatches = async (type) => {
  const url = type ? `${BASE_URL}/${type}` : `${BASE_URL}`;
  const res = await api.get(url);
  return res.data?.data;
};

// ✅ Get match details
export const getMatchDetails = async (id) => {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data?.data;
};
// ✅ Get match timeline (NEW)
export const getMatchTimeline = async (id) => {
  const res = await api.get(`/matches/${id}/timeline`);
  return res.data?.data;
};
export const getLiveScore = async (id) => {
  const res = await api.get(`/scoring/match/${id}/live`);
  return res.data?.data;
};
// Scorecard API
export const getScorecard = async (id) => {
  const res = await api.get(`/scoring/match/${id}/scorecard`);
  return res.data?.data;
};