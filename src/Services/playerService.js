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
  if (!id) {
    console.warn('[PLAYER-SERVICE] No player ID provided to getPlayerById');
    throw new Error('Player ID is required');
  }
  
  const playerId = String(id?._id || id || '');
  if (!playerId || playerId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(playerId)) {
    console.warn(`[PLAYER-SERVICE] Invalid player ID format:`, id, '→', playerId);
    throw new Error('Invalid player ID format (must be 24-char MongoDB ID)');
  }

  const response = await api.get(`/players/public/${playerId}`);
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
      const idStr = String(id?._id || id || '');
      if (!idStr || idStr.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(idStr)) {
        console.warn(`[PLAYER-SERVICE] Skipping invalid ID in batch:`, id);
        playerMap[idStr] = 'Invalid ID';
        continue;
      }
      
      try {
        const response = await api.get(`/players/public/${idStr}`);
        const player = response.data.data;
        playerMap[idStr] = `${player.name || 'Unknown'} (${player.role || ''})`;
      } catch (err) {
        console.warn(`[PLAYER-SERVICE] Failed to fetch player ${idStr}:`, err.message);
        playerMap[idStr] = 'Unknown Player';
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

