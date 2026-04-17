import api from "../config/api";
import { io } from "socket.io-client";
import { API_BASE } from "../config/api";

const BASE_URL = "/matches";
let socket = null;

// Socket connection helper
export const initMatchSocket = (token) => {
  if (socket) socket.disconnect();
  socket = io(API_BASE, {
    auth: { token }
  });
  return socket;
};

export const joinMatchRoom = (matchId) => {
  if (socket) socket.emit("join-match", matchId);
};

export const leaveMatchRoom = (matchId) => {
  if (socket) socket.emit("leave-match", matchId);
};

// Listen for events
export const onScoreUpdate = (callback) => socket?.on("scoreUpdated", callback);
export const onTossUpdate = (callback) => socket?.on("tossUpdate", callback);
export const onInningsStart = (callback) => socket?.on("inningsStart", callback);
export const onWicketFall = (callback) => socket?.on("wicketFall", callback);
export const onBoundary = (callback) => socket?.on("boundary", callback);
export const onWagonWheelUpdate = (callback) => socket?.on("wagonWheelUpdate", callback);

// ✅ Existing GET APIs
export const getMatches = async (type) => {
  const url = type ? `${BASE_URL}/${type}` : `${BASE_URL}`;
  const res = await api.get(url);
  return res.data?.data;
};

export const getMatchDetails = async (id) => {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data?.data;
};

export const getMatchTimeline = async (id) => {
  const res = await api.get(`/matches/${id}/timeline`);
  return res.data?.data;
};

export const getLiveScore = async (id) => {
  const res = await api.get(`/scoring/match/${id}/live`);
  return res.data?.data;
};

export const getScorecard = async (id) => {
  const res = await api.get(`/scoring/match/${id}/scorecard`);
  return res.data?.data;
};

export const searchMatches = async (query) => {
  if (!query) return [];
  const res = await api.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  return res.data?.data || [];
};

// 🔥 NEW CREATION APIs
export const createMatch = async (matchData) => {
  const res = await api.post(BASE_URL, matchData);
  return res.data?.data;
};

// 🔥 MATCH CONTROL APIs
export const updateMatchStatus = async (id, status) => {
  const res = await api.patch(`${BASE_URL}/${id}/status`, { status });
  return res.data?.data;
};

export const updateToss = async (id, tossData) => {
  const res = await api.patch(`${BASE_URL}/${id}/toss`, tossData);
  return res.data?.data;
};

export const scheduleMatch = async (id, scheduleData) => {
  const res = await api.patch(`${BASE_URL}/${id}/schedule`, scheduleData);
  return res.data?.data;
};

// 🔥 SCORING APIs
export const initializeMatch = async (matchId, data) => {
  const res = await api.post(`/scoring/match/${matchId}/initialize`, data);
  return res.data?.data;
};

export const startInnings = async (matchId, inningsNumber) => {
  const res = await api.post(`/scoring/match/${matchId}/innings/start`, { inningsNumber });
  return res.data?.data;
};

export const endInnings = async (matchId) => {
  const res = await api.post(`/scoring/match/${matchId}/innings/end`);
  return res.data?.data;
};

export const addBall = async (matchId, ballData) => {
  const res = await api.post(`/scoring/match/${matchId}/ball`, ballData);
  return res.data?.data;
};

export const setStriker = async (matchId, batsmanId) => {
  const res = await api.patch(`/scoring/match/${matchId}/striker`, { batsmanId });
  return res.data?.data;
};

export const setNonStriker = async (matchId, batsmanId) => {
  const res = await api.patch(`/scoring/match/${matchId}/non-striker`, { batsmanId });
  return res.data?.data;
};

export const setBowler = async (matchId, bowlerId) => {
  const res = await api.patch(`/scoring/match/${matchId}/bowler`, { bowlerId });
  return res.data?.data;
};

export const getSocket = () => socket;

