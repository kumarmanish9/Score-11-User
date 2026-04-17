import api from '../config/api';

export const getPlayers = async () => {
  const response = await api.get('/players/trending');
  return response.data.data || [];
};

export const searchPlayers = async (query) => {
  const response = await api.get(`/players/search?q=${query}`);
  return response.data.data || [];
};

export const getPlayerById = async (id) => {
  const response = await api.get(`/players/public/${id}`);
  return response.data.data;
};

export const getPublicTeam = getPlayerById;

// ✅ Instant player APIs
export const createPlayer = async (playerData) => {
  const response = await api.post('/players/', playerData);
  return response.data.data;
};

export const getAllPlayers = async () => {
  const response = await api.get('/players');
  return response.data.data.players || [];
};

export const deletePlayer = async (id) => {
  const response = await api.delete(`/players/${id}`);
  return response.data;
};

