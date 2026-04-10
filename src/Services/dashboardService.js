import api from '../config/api';

export const getLiveMatches = async () => {
  const response = await api.get('/dashboard/live-matches');
  return response.data.data || response.data || [];
};

export const getUpcomingMatches = async () => {
  const response = await api.get('/dashboard/upcoming-matches');
  return response.data.data || response.data || [];
};

export const getLeaderboardTop = async (period) => {
  const params = period ? { params: { period } } : undefined;
  const response = await api.get('/dashboard/leaderboard/top', params);
  return response.data.data || response.data || [];
};

// 👉 Dashboard overview (mobile home)
export const getDashboardOverview = async () => {
  const response = await api.get('/dashboard');
  return response.data.data || response.data || {};
};

// 👉 Trending players
export const getTrendingPlayers = async () => {
  const response = await api.get('/dashboard/trending-players');
  return response.data.data || response.data || [];
};

export default {
  getLiveMatches,
  getUpcomingMatches,
  getLeaderboardTop,
  getDashboardOverview,
  getTrendingPlayers,
};
