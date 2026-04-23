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
  try {
    const response = await api.get('/players');
    console.log('[PLAYER-SERVICE] Raw response:', response.data);
    const players = response.data.data || [];
    console.log('[PLAYER-SERVICE] Parsed players:', players.length);
    return players;
  } catch (error) {
    console.error('[PLAYER-SERVICE] getAllPlayers error:', error.response?.data || error.message);
    return [];
  }
};

export const getPlayersByIds = async (playerIds) => {
  if (!playerIds || playerIds.length === 0) return {};
  try {
    // Fallback to individual lookups since /players/by-ids endpoint doesn't exist
    const playerMap = {};
    for (const id of Array.from(new Set(playerIds))) {
      try {
        const response = await api.get(`/players/public/${id}`);
        const player = response.data.data;
        playerMap[id] = `${player.name || 'Unknown'} (${player.role || ''})`;
      } catch (err) {
        playerMap[id] = 'Unknown Player';
      }
    }
    return playerMap;
  } catch (error) {
    console.warn('Failed to fetch players by IDs:', error);
    return {};
  }
};

export const deletePlayer = async (id) => {
  const response = await api.delete(`/players/${id}`);
  return response.data;
};

// 🔥 NEW: User-specific players (for lineup restriction)
export const getMyPlayers = async () => {
  const response = await api.get('/players/my');
  return response.data.data || [];
};

export const searchMyPlayers = async (query) => {
  const response = await api.get(`/players/my/search?q=${query}`);
  return response.data.data || [];
};
// 🔥 NEW: Get players by team (for lineup restriction)
export const getPlayersByTeam = async (teamId) => {
  const response = await api.get(`/players/team/${teamId}`);
  return response.data.data || [];
};

// 🔥 NEW: Get player-specific matches (for PlayerProfile)
export const getPlayerMatches = async (playerId, type = 'all') => {
  const params = new URLSearchParams({ type });
  const response = await api.get(`/players/public/${playerId}/matches?${params}`);
  return response.data.data.matches || [];
};

