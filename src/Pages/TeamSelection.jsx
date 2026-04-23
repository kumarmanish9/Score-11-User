import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaCheckCircle, FaPlay, FaBaseballBall, FaShieldAlt, FaStar, FaUser } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';  // 🔥 NEW: Import AuthContext
import { getMatchDetails, setMatchLineups, onLineupsUpdate, initMatchSocket, joinMatchRoom } from '../Services/matchService';
import { getTeamWithPlayers } from '../Services/teamWithPlayersService.js';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .team-selection-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Main Card */
  .selection-card {
    background: white;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  /* Card Header */
  .card-header-custom {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 30px 35px;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .card-header-custom::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .btn-back {
    background: rgba(255,255,255,0.1);
    color: white;
    padding: 10px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-back:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(-2px);
  }

  .page-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .page-subtitle {
    font-size: 14px;
    opacity: 0.85;
    margin-top: 12px;
  }

  /* Teams Row */
  .teams-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    padding: 35px;
  }

  /* Team Card */
  .team-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
  }

  .team-header {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .team-header.team1 {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .team-header.team2 {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  .team-name-header {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin: 0;
  }

  .player-count {
    background: rgba(255,255,255,0.2);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    color: white;
  }

  /* Players Grid */
  .players-container {
    padding: 20px;
    max-height: 500px;
    overflow-y: auto;
  }

  .players-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  .player-card {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .player-card:hover {
    transform: translateY(-2px);
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .player-card.selected {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    border-color: #10b981;
  }

  .player-card.owner-only {
    border-left: 4px solid #10b981;
  }

  .player-checkbox {
    width: 24px;
    height: 24px;
  }

  .player-checkbox input {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #10b981;
  }

  .player-avatar-small {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    color: white;
  }

  .player-info {
    flex: 1;
  }

  .player-name {
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .player-number {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }

  /* Start Button */
  .start-section {
    padding: 0 35px 35px 35px;
    text-align: center;
  }

  .btn-start {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 18px 40px;
    border: none;
    border-radius: 20px;
    font-size: 18px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .btn-start:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(245, 158, 11, 0.3);
  }

  .btn-start:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-start-disabled {
    background: #cbd5e1;
    color: #64748b;
  }

  /* Warning Message */
  .warning-message {
    margin-top: 16px;
    font-size: 13px;
    color: #f59e0b;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* Owner Badge */
  .owner-badge {
    background: #10b981;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 700;
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .custom-spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Scrollbar Styling */
  .players-container::-webkit-scrollbar {
    width: 6px;
  }

  .players-container::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  .players-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .players-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .teams-row {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  @media (max-width: 768px) {
    .team-selection-page {
      padding: 20px 0;
    }
    .card-header-custom {
      padding: 20px 24px;
    }
    .page-title {
      font-size: 22px;
    }
    .teams-row {
      padding: 20px;
    }
    .players-grid {
      grid-template-columns: 1fr;
    }
    .btn-start {
      padding: 14px 28px;
      font-size: 16px;
    }
  }
`;

const TeamSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  // 🔥 NEW: Get current user

  const [match, setMatch] = useState(null);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);  // 🔥 Will be filtered
  const [team2Players, setTeam2Players] = useState([]);  // 🔥 Will be filtered
  const [selectedTeam1Players, setSelectedTeam1Players] = useState([]);
  const [selectedTeam2Players, setSelectedTeam2Players] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noOwnerPlayersMsg, setNoOwnerPlayersMsg] = useState('');

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

  // 🔥 NEW: Filter players owned by current user only
  const filterMyPlayers = (allPlayers) => {
    if (!user?._id) {
      console.warn('No user ID - cannot filter players');
      return [];
    }
    const myPlayers = allPlayers.filter(player => 
      player.owner?._id === user._id || 
      player.owner === user._id || 
      player.createdBy === user._id
    );
    setNoOwnerPlayersMsg(myPlayers.length === 0 ? 'No players owned by you in this team. Create players in your profile first.' : '');
    return myPlayers;
  };

  const fetchMatch = async () => {
    try {
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      const [t1, t2] = await Promise.all([
        getTeamWithPlayers(matchData.team1._id),
        getTeamWithPlayers(matchData.team2._id)
      ]);
      setTeam1(t1);
      setTeam2(t2);
      
      // 🔥 FILTER: Only show user's own players
      const filteredTeam1Players = filterMyPlayers(t1.players || []);
      const filteredTeam2Players = filterMyPlayers(t2.players || []);
      setTeam1Players(filteredTeam1Players);
      setTeam2Players(filteredTeam2Players);
      
      // Load existing lineups (keep as-is, but selections limited to my players)
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
      if (selected.length < 11) {
        selector([...selected, player]);
      } else {
        alert('Maximum 11 players per team allowed');
      }
    }
  };

  const getPlayerInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
  };

  const isValidLineup = () => selectedTeam1Players.length >= 2 && selectedTeam2Players.length >= 2;

  const handleStartMatch = async () => {
    if (!isValidLineup()) {
      alert('Minimum 2 players required per team to start the match');
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

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading teams and players...</p>
        </div>
      </>
    );
  }

  if (!match || !team1 || !team2) {
    return (
      <>
        <style>{styles}</style>
        <div className="team-selection-page">
          <div className="container">
            <div className="text-center p-5">
              <h3>Match not found</h3>
              <button className="btn-back mt-3" onClick={() => navigate('/matches')}>
                Back to Matches
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="team-selection-page">
        <div className="container">
          <div className="selection-card">
            <div className="card-header-custom">
              <div className="header-top">
                <button className="btn-back" onClick={() => navigate(`/match/${id}/toss`)}>
                  <FaArrowLeft /> Back to Toss
                </button>
                <div className="page-title">
                  <FaBaseballBall /> Team Selection
                </div>
                <div style={{ width: 100 }}></div>
              </div>
              <div className="page-subtitle">
                Select minimum 2 players per team (max 11). Selected players will play in the match.
                <br />
                <strong>🔒 Your Players Only:</strong> Only players owned by your profile are shown.
              </div>
            </div>

            <div className="teams-row">
              {/* Team 1 Selection */}
              <div className="team-card">
                <div className="team-header team1">
                  <h3 className="team-name-header">
                    <FaUsers style={{ marginRight: 8 }} />
                    {team1.name}
                  </h3>
                  <span className="player-count">
                    {selectedTeam1Players.length}/11 Selected ({team1Players.length} your players)
                  </span>
                </div>
                <div className="players-container">
                  {noOwnerPlayersMsg ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                      ⚠️ {noOwnerPlayersMsg}
                    </div>
                  ) : (
                    <div className="players-grid">
                      {team1Players.map(player => (
                        <div 
                          key={player._id} 
                          className={`player-card selected ${selectedTeam1Players.some(p => p._id === player._id) ? 'selected' : ''} owner-only`}
                          onClick={() => togglePlayer(player._id, 'team1')}
                          title={`Owner: ${player.owner?.name || 'You'}`}
                        >
                          <div className="player-checkbox">
                            <input 
                              type="checkbox" 
                              checked={selectedTeam1Players.some(p => p._id === player._id)}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="player-avatar-small">
                            {getPlayerInitials(player.playerName || player.name)}
                          </div>
                          <div className="player-info">
                            <div className="player-name">{player.playerName || player.name}</div>
                            <div className="player-number">#{player.jerseyNumber || 'N/A'}</div>
                            <div style={{ fontSize: '10px', color: '#10b981' }}>👤 Yours</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Team 2 Selection */}
              <div className="team-card">
                <div className="team-header team2">
                  <h3 className="team-name-header">
                    <FaUsers style={{ marginRight: 8 }} />
                    {team2.name}
                  </h3>
                  <span className="player-count">
                    {selectedTeam2Players.length}/11 Selected ({team2Players.length} your players)
                  </span>
                </div>
                <div className="players-container">
                  {noOwnerPlayersMsg ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                      ⚠️ {noOwnerPlayersMsg}
                    </div>
                  ) : (
                    <div className="players-grid">
                      {team2Players.map(player => (
                        <div 
                          key={player._id} 
                          className={`player-card ${selectedTeam2Players.some(p => p._id === player._id) ? 'selected' : ''} owner-only`}
                          onClick={() => togglePlayer(player._id, 'team2')}
                          title={`Owner: ${player.owner?.name || 'You'}`}
                        >
                          <div className="player-checkbox">
                            <input 
                              type="checkbox" 
                              checked={selectedTeam2Players.some(p => p._id === player._id)}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="player-avatar-small">
                            {getPlayerInitials(player.playerName || player.name)}
                          </div>
                          <div className="player-info">
                            <div className="player-name">{player.playerName || player.name}</div>
                            <div className="player-number">#{player.jerseyNumber || 'N/A'}</div>
                            <div style={{ fontSize: '10px', color: '#10b981' }}>👤 Yours</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="start-section">
              <button 
                className={`btn-start ${!isValidLineup() ? 'btn-start-disabled' : ''}`}
                onClick={handleStartMatch}
                disabled={!isValidLineup()}
              >
                <FaPlay /> START MATCH
              </button>
              {!isValidLineup() && (
                <div className="warning-message">
                  <FaShieldAlt />
                  Need at least 2 players selected from each team to start
                </div>
              )}
              {isValidLineup() && (
                <div className="warning-message" style={{ color: '#10b981' }}>
                  <FaCheckCircle />
                  Ready to start! Both teams have valid lineups (your players only).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamSelection;

