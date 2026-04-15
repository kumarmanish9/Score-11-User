import api from '../config/api';

export const getLeaderboard = async () => {
  const response = await api.get('/leaderboard');
  return response.data.data || [];
};

export const getPlayerLeaderboard = async () => {
  const response = await api.get('/leaderboard/players');
  return response.data.data || [];
};

export const getBatsmanLeaderboard = async () => {
  const response = await api.get('/leaderboard/batsmen');
  return response.data.data || [];
};

export const getBowlerLeaderboard = async () => {
  const response = await api.get('/leaderboard/bowlers');
  return response.data.data || [];
};

export const getAllRounderLeaderboard = async () => {
  const response = await api.get('/leaderboard/all-rounders');
  return response.data.data || [];
};

export const getTeamLeaderboard = async () => {
  const response = await api.get('/leaderboard/teams');
  return response.data.data || [];
};

export const getTournamentLeaderboard = async (tournamentId) => {
  const response = await api.get(`/leaderboard/tournament/${tournamentId}`);
  return response.data.data || [];
};

export const getMatchLeaderboard = async (matchId) => {
  const response = await api.get(`/leaderboard/match/${matchId}`);
  return response.data.data || [];
};
