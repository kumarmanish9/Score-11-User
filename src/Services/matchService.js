import api from "../config/api";
import { io } from "socket.io-client";
import { API_BASE } from "../config/api";

const BASE_URL = "/matches";
let socket = null;

// Socket connection helper
export const initMatchSocket = (token) => {
  if (socket) socket.disconnect();
  
const socketBase = import.meta.env.VITE_SOCKET_URL;
  socket = io(socketBase, {
    auth: { token },
    // transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    path: '/socket.io/'
  });
  console.log('🔌 Socket connected to:', socketBase);
  console.log("🌐 Socket URL:", socketBase);
  return socket;
};

export const joinMatchRoom = (matchId) => {
  if (socket) socket.emit("join-match", matchId);
};

export const leaveMatchRoom = (matchId) => {
  if (socket) socket.emit("leave-match", matchId);
};

// Listen for events  
export const onLiveScoreUpdate = (callback) => socket?.on("liveScoreUpdate", callback);
export const onScoreUpdate = (callback) => socket?.on("scoreUpdated", callback);
export const onTossUpdate = (callback) => socket?.on("tossUpdate", callback);
export const onInningsStart = (callback) => socket?.on("inningsStart", callback);
export const onWicketFall = (callback) => socket?.on("wicketFall", callback);
export const onBoundary = (callback) => socket?.on("boundary", callback);
export const onWagonWheelUpdate = (callback) => socket?.on("wagonWheelUpdate", callback);
export const onLineupsUpdate = (callback) => socket?.on("lineupsUpdate", callback);
export const onTurnUpdate = (callback) => socket?.on("turnUpdate", callback);

// ✅ Existing GET APIs
export const getMatches = async (type, query = {}) => {
  let url = BASE_URL;
  const params = new URLSearchParams(query);
  if (type) {
    url += `/${type}`;
  }
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  const res = await api.get(url);
  return res.data?.data?.matches || res.data?.data || [];
};



// Get user's own matches - PRIVATE (owner only)
export const getMyMatches = async (params = {}) => {
  try {
    const query = { ...params };
    if (query.status && !query.owner) {
      query.owner = true; // Filter for user's matches when status provided
    }
    const url = BASE_URL;
    console.log('🔍 getMyMatches URL:', `${url}?${new URLSearchParams(query).toString()}`);
    const res = await api.get(url, { params: query });
    return res.data?.data?.matches || res.data?.data || res.data || [];
  } catch (error) {
    console.error('getMyMatches error:', error.response?.data || error.message);
    console.warn('🔄 Falling back to public matches');
    const fallbackStatus = params.status?.[0] || 'scheduled';
    return getAllMatchesWithFilter(fallbackStatus);
  }
};


export const getAllMatchesWithFilter = async (status) => {
  return getMatches(null, { status });
};




export const getMatchDetails = async (id) => {
  // ✅ FIXED: Validate ID before API call
  const idStr = id ? String(id).trim() : '';
  if (!idStr || idStr.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(idStr)) {
    console.error('❌ getMatchDetails: Invalid ID:', idStr);
    throw new Error(`Invalid match ID format: ${idStr}`);
  }
  
  try {
    const res = await api.get(`${BASE_URL}/${idStr}`);
    return res.data?.data;
  } catch (error) {
    console.error('getMatchDetails failed for ID:', idStr, error.response?.data || error.message);
    throw error;
  }
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
  console.log('📤 Creating match with data:', matchData);
  try {
    const res = await api.post(BASE_URL, matchData);
    console.log('✅ Match created:', res.data?.data);
    return res.data?.data;
  } catch (error) {
    console.error('❌ Match create error:', error.response?.data || error.message);
    throw error;
  }
};


// 🔥 MATCH CONTROL APIs
export const startMatch = async (id) => {
  try {
    const res = await api.patch(`${BASE_URL}/${id}/start`);
    console.log('✅ Start match response:', res.data?.data);
    return res.data?.data;
  } catch (error) {
    console.error('❌ Start match error:', error.response?.data || error.message);
    throw error;
  }
};


export const updateMatchStatus = async (id, status) => {
  try {
    const res = await api.patch(`${BASE_URL}/${id}/status`, { status });
    return res.data?.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Match status update endpoint not available. Use Live Control screen instead.');
    }
    throw error;
  }
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

export const setMatchLineups = async (matchId, lineups) => {
  const res = await api.patch(`/matches/${matchId}/lineups`, lineups);
  return res.data?.data;
};

export const getSocket = () => socket;
