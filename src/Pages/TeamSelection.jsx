import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetails, setMatchLineups, onLineupsUpdate, initMatchSocket, joinMatchRoom } from '../Services/matchService';
import { getTeamById } from '../Services/teamService';
import { getPlayerById } from '../Services/playerService';
import "../assets/Styles/Global.css";

const TeamSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [selectedTeam1Players, setSelectedTeam1Players] = useState([]);
  const [selectedTeam2Players, setSelectedTeam2Players] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
    const token = localStorage.getItem('token');
    if (token) {
      initMatchSocket(token);
      joinMatchRoom(id);
      const handleLineupsUpdate = (data) => {
        setSelectedTeam1Players(data.team1Lineup || []);
        setSelectedTeam2Players(data.team2Lineup || []);
      };
      onLineupsUpdate(handleLineupsUpdate);
      return () => {
        // Cleanup listeners
      };
    }
  }, [id]);

  const fetchMatch = async () => {
    try {
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      const [t1, t2] = await Promise.all([
        getTeamById(matchData.team1._id),
        getTeamById(matchData.team2._id)
      ]);
      setTeam1(t1);
      setTeam2(t2);
      
      // Load team players
      const allTeam1Players = await Promise.all(t1.players.map(p => getPlayerById(p)));
      const allTeam2Players = await Promise.all(t2.players.map(p => getPlayerById(p)));
      setTeam1Players(allTeam1Players);
      setTeam2Players(allTeam2Players);
      
      // Load existing lineups
      setSelectedTeam1Players(matchData.team1Lineup || []);
      setSelectedTeam2Players(matchData.team2Lineup || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerId, teamKey) => {
    const selector = teamKey === 'team1' ? setSelectedTeam1Players : setSelectedTeam2Players;
    const selected = teamKey === 'team1' ? selectedTeam1Players : selectedTeam2Players;
    
    const isSelected = selected.some(p => p._id === playerId);
    if (isSelected) {
      selector(selected.filter(p => p._id !== playerId));
    } else {
      const player = (teamKey === 'team1' ? team1Players : team2Players).find(p => p._id === playerId);
      selector([...selected, player]);
    }
  };

  const isValidLineup = () => selectedTeam1Players.length >= 2 && selectedTeam2Players.length >= 2;

  const handleStartMatch = async () => {
    if (!isValidLineup()) {
      alert('Minimum 2 players required per team');
      return;
    }

    try {
      await setMatchLineups(id, {
        team1Lineup: selectedTeam1Players.map(p => p._id),
        team2Lineup: selectedTeam2Players.map(p => p._id)
      });
      navigate(`/match/${id}/live-control`);
    } catch (err) {
      alert('Error starting match: ' + err.message);
    }
  };

  if (loading) return <div className="text-center p-5">Loading teams...</div>;
  if (!match || !team1 || !team2) return <div className="text-center p-5">Match not found</div>;

  return (
    <div className="min-vh-100 bg-gradient-to-br from-indigo-50 to-blue-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card shadow-xl border-0">
              <div className="card-body p-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <button className="btn btn-outline-secondary" onClick={() => navigate(`/match/${id}/toss`)}>
                    ← Back to Toss
                  </button>
                  <h1 className="display-5 fw-bold text-primary mb-0">⚾ Team Selection</h1>
                  <div />
                </div>

                <p className="lead text-muted mb-5">
                  Select minimum 2 players per team (max 11). Ready teams → "Start Match"
                </p>

                <div className="row g-4">
                  {/* Team 1 Selection */}
                  <div className="col-lg-6">
                    <div className="card h-100">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">{team1.name} ({selectedTeam1Players.length}/11)</h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="players-grid">
                          {team1Players.map(player => (
                            <div key={player._id} className={`player-card ${selectedTeam1Players.some(p => p._id === player._id) ? 'selected' : ''}`}>
                              <div className="player-checkbox">
                                <input 
                                  type="checkbox" 
                                  id={player._id}
                                  checked={selectedTeam1Players.some(p => p._id === player._id)}
                                  onChange={() => togglePlayer(player._id, 'team1')}
                                />
                              </div>
                              <div className="player-info">
                                <strong>{player.playerName}</strong>
                                <small className="text-muted">#{player.jerseyNumber}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team 2 Selection */}
                  <div className="col-lg-6">
                    <div className="card h-100">
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">{team2.name} ({selectedTeam2Players.length}/11)</h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="players-grid">
                          {team2Players.map(player => (
                            <div key={player._id} className={`player-card ${selectedTeam2Players.some(p => p._id === player._id) ? 'selected' : ''}`}>
                              <div className="player-checkbox">
                                <input 
                                  type="checkbox" 
                                  id={player._id}
                                  checked={selectedTeam2Players.some(p => p._id === player._id)}
                                  onChange={() => togglePlayer(player._id, 'team2')}
                                />
                              </div>
                              <div className="player-info">
                                <strong>{player.playerName}</strong>
                                <small className="text-muted">#{player.jerseyNumber}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button 
                    className={`btn btn-lg px-5 py-3 fw-bold shadow-lg ${isValidLineup() ? 'btn-success' : 'btn-outline-success disabled'}`} 
                    onClick={handleStartMatch}
                    disabled={!isValidLineup()}
                  >
                    🚀 START MATCH (Min 2 players/team)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          max-height: 500px;
          overflow-y: auto;
        }
        .player-card {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .player-card:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
        }
        .player-card.selected {
          border-color: #28a745;
          background: #d4edda;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .player-checkbox input {
          width: 20px;
          height: 20px;
          accent-color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default TeamSelection;

