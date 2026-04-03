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
