import api from '../config/api';
import { getPlayerById } from './playerService.js';

export const getTeamWithPlayers = async (teamId) => {
  const response = await api.get(`/teams/${teamId}?populate=players`);
  const team = response.data.data;
  
  // Ensure players are fully populated with role
  if (team.players && team.players.length > 0) {
    team.players = await Promise.all(
      team.players.map(async (p) => {
        if (!p.role) {
          const fullPlayer = await getPlayerById(p._id);
          return fullPlayer;
        }
        return p;
      })
    );
  }
  
  return team;
};

