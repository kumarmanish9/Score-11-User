import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaUsers, FaSearch, FaPlus, FaTimes, FaCrown, FaStar, FaUpload, FaInfoCircle, FaMapMarkerAlt, FaUserTie, FaBuilding, FaGlobe, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";  // 🔥 NEW: Auth for user ID
import { createTeam, uploadTeamLogo, getMyTeams } from "../Services/teamService";
import { getMatches, getMatchDetails } from "../Services/matchService";
import { searchMyPlayers } from "../Services/playerService";  // 🔥 CHANGED: Use searchMyPlayers only

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .create-team-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-left h1 {
    font-size: 36px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .header-left p {
    font-size: 15px;
    color: #64748b;
  }

  .btn-back-header {
    background: white;
    color: #475569;
    padding: 12px 24px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .btn-back-header:hover {
    background: #f8fafc;
    transform: translateX(-2px);
  }

  /* Grid Layout */
  .two-column-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 30px;
  }

  /* Card Styles */
  .form-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
  }

  .card-header-custom {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 18px 24px;
    color: white;
  }

  .card-header-custom h3 {
    font-size: 18px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-body-custom {
    padding: 24px;
  }

  /* Form Elements */
  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .form-control-custom {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    transition: all 0.2s ease;
    background: #f8fafc;
  }

  .form-control-custom:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  select.form-control-custom {
    cursor: pointer;
  }

  textarea.form-control-custom {
    resize: vertical;
    min-height: 100px;
  }

  /* Logo Upload */
  .logo-upload-area {
    border: 2px dashed #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f8fafc;
  }

  .logo-upload-area:hover {
    border-color: #3b82f6;
    background: #f1f5f9;
  }

  .logo-preview {
    margin-top: 16px;
    width: 100%;
    height: 120px;
    border-radius: 16px;
    object-fit: cover;
  }

  /* Match Selector */
  .match-selector-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .match-type-select {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: white;
  }

  .matches-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .match-item {
    width: 100%;
    padding: 14px;
    margin-bottom: 10px;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    background: white;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .match-item:hover {
    border-color: #3b82f6;
    transform: translateX(4px);
  }

  .match-item.selected {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-color: #3b82f6;
    color: white;
  }

  .match-name {
    font-weight: 800;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .match-date {
    font-size: 11px;
    opacity: 0.7;
  }

  /* Player Search */
  .search-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .search-icon-input {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .search-input-player {
    width: 100%;
    padding: 14px 16px 14px 48px;
    font-size: 14px;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .search-input-player:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .players-list {
    max-height: 350px;
    overflow-y: auto;
  }

  .player-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
  }

  .player-item:hover {
    background: #f8fafc;
  }

  .player-info h4 {
    font-size: 14px;
    font-weight: 800;
    margin: 0 0 4px 0;
    color: #1e293b;
  }

  .player-role-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #e2e8f0;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    color: #475569;
  }

  .btn-add-player {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add-player:hover {
    transform: scale(1.05);
  }

  /* Team Grid */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .player-slot {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px;
    position: relative;
    transition: all 0.2s ease;
    min-height: 160px;
  }

  .player-slot.filled {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: #667eea;
    color: white;
  }

  .player-slot.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #94a3b8;
  }

  .slot-number {
    position: absolute;
    top: 8px;
    left: 12px;
    font-size: 11px;
    font-weight: 700;
    opacity: 0.5;
  }

  .captain-badge {
    position: absolute;
    top: 8px;
    right: 12px;
    color: #fbbf24;
    font-size: 14px;
  }

  .vice-captain-badge {
    position: absolute;
    bottom: 8px;
    right: 12px;
    color: #60a5fa;
    font-size: 12px;
  }

  .player-name-slot {
    font-size: 13px;
    font-weight: 800;
    text-align: center;
    margin-top: 24px;
    margin-bottom: 4px;
  }

  .player-role-slot {
    font-size: 10px;
    text-align: center;
    opacity: 0.8;
  }

  .slot-actions {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
  }

  .slot-btn {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slot-btn-captain {
    background: rgba(255,255,255,0.2);
    color: #fbbf24;
  }

  .slot-btn-vice {
    background: rgba(255,255,255,0.2);
    color: #60a5fa;
  }

  .slot-btn-remove {
    background: rgba(255,255,255,0.2);
    color: #ef4444;
  }

  /* Submit Button */
  .btn-submit-team {
    width: 100%;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 16px;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .btn-submit-team:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
  }

  .btn-submit-team:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  /* Responsive */
  @media (max-width: 1024px) {
    .two-column-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .create-team-page {
      padding: 20px 0;
    }
    .header-left h1 {
      font-size: 24px;
    }
    .team-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }
`;

// 🔥 NEW: Filter players to user's only
const normalizePlayer = (p) => {
  if (!p || typeof p !== "object") {
    return { name: "Unknown Player" };
  }

  const name =
    p.name ||
    p.fullName ||
    p.playerName ||
    p.shortName ||
    p.short_name ||
    p.displayName ||
    (p.player && (p.player.name || p.player.fullName)) ||
    "Unknown Player";

  const role = p.role || p.playerRole || p.roleType || 'BAT';

  return { ...p, name, role: role.toUpperCase() };
};

function CreateTeam() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  // 🔥 NEW: Get user ID

  const [teamInfo, setTeamInfo] = useState({
    name: "",
    shortName: "",
    coach: "",
    description: "",
    city: "",
    state: "Maharashtra",
    country: "India"
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchType, setMatchType] = useState("upcoming");

  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const [team, setTeam] = useState(Array(11).fill(null));
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [noPlayersMsg, setNoPlayersMsg] = useState('');

  useEffect(() => {
    fetchMatches();
  }, [matchType]);

  const fetchMatches = async () => {
    try {
      const data = await getMatches(matchType);
      setMatches((data || []).slice(0, 5));
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  useEffect(() => {
    const loadMatchPlayers = async () => {
      if (!selectedMatch?._id) return;

      try {
        const detail = await getMatchDetails(selectedMatch._id);
        let matchPlayers = [];

        if (Array.isArray(detail?.players)) {
          matchPlayers = detail.players;
        } else if (Array.isArray(detail?.squad)) {
          matchPlayers = detail.squad;
        } else if (detail?.team1?.players || detail?.team2?.players) {
          matchPlayers = [
            ...(detail.team1?.players || []),
            ...(detail.team2?.players || []),
          ];
        }

        matchPlayers = matchPlayers.map(normalizePlayer);
        setAvailablePlayers(matchPlayers);
        setPlayers(matchPlayers.slice(0, 12));
      } catch (err) {
        console.error("Error fetching match details:", err);
        setAvailablePlayers([]);
        setPlayers([]);
      }
    };

    loadMatchPlayers();
  }, [selectedMatch]);

  useEffect(() => {
    fetchPlayers();
  }, [searchQuery, selectedMatch]);

  const fetchPlayers = async () => {
    try {
      const query = searchQuery.trim().toLowerCase();
      if (!query || query.length < 2) {
        if (selectedMatch) {
          setPlayers(availablePlayers.slice(0, 24));
        } else {
          setPlayers([]);
        }
        return;
      }

      // 🔥 CHANGED: Use searchMyPlayers() - user's players only
      const apiData = await searchMyPlayers(query);
      const normalizedAPI = (apiData || []).map(normalizePlayer);
      setNoPlayersMsg(normalizedAPI.length === 0 ? 'No matching players in your profile. Create players first.' : '');

      if (selectedMatch) {
        const localFiltered = availablePlayers.filter((p) =>
          (p.name || "").toLowerCase().includes(query)
        );
        const combined = [...localFiltered, ...normalizedAPI];
        const unique = [];
        const seen = new Set();
        for (let p of combined) {
          const key = p._id || p.name;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(p);
          }
        }
        setPlayers(unique.slice(0, 24));
      } else {
        setPlayers(normalizedAPI);
      }
   } catch (err) {
  console.error("FULL ERROR 👉", err);
  console.log("STATUS 👉", err?.response?.status);
  console.log("DATA 👉", err?.response?.data);
  setNoPlayersMsg(err?.response?.data?.message || 'API Error');
}
  };

  const addToTeam = (player) => {
    if (!player || !player._id) return;
    if (team.some((p) => p && p._id === player._id)) return;
    const firstEmpty = team.findIndex((p) => !p);
    if (firstEmpty === -1) return;
    const newTeam = [...team];
    newTeam[firstEmpty] = player;
    setTeam(newTeam);
  };

  const removeFromTeam = (position) => {
    const newTeam = [...team];
    newTeam[position] = null;
    setTeam(newTeam);
    if (captain === team[position]) setCaptain(null);
    if (viceCaptain === team[position]) setViceCaptain(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const validPlayers = team.filter((p) => p && p._id);
      if (validPlayers.length !== 11) {
        alert("Select exactly 11 players");
        return;
      }

      if (!captain || !captain._id || !viceCaptain || !viceCaptain._id || captain._id === viceCaptain._id) {
        alert("Select unique Captain & Vice-Captain");
        return;
      }

      if (!selectedMatch || !selectedMatch._id) {
        alert("Select a match");
        return;
      }

      if (!teamInfo.name.trim()) {
        alert("Enter team name");
        return;
      }

      setSubmitLoading(true);

      const teamData = {
        name: teamInfo.name,
        shortName: teamInfo.shortName,
        coach: teamInfo.coach,
        description: teamInfo.description,
        city: teamInfo.city,
        state: teamInfo.state,
        country: teamInfo.country,
        matchId: selectedMatch._id,
        players: validPlayers.map((p) => p._id),
        captainId: captain._id,
        viceCaptainId: viceCaptain._id,
      };

      const response = await createTeam(teamData);
      const newTeamId = response.data?._id;

      if (logoFile && newTeamId) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await uploadTeamLogo(newTeamId, formData);
      }

      alert("Team created successfully! (Your players only)");
      navigate("/teams?refresh=1");
    } catch (err) {
      console.error("Error:", err);
      alert(err?.response?.data?.message || "Error creating team");
    } finally {
      setSubmitLoading(false);
    }
  };

  const setCaptainHandler = (player) => setCaptain(player);
  const setViceCaptainHandler = (player) => setViceCaptain(player);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="create-team-page">
        <div className="container">
          <div className="page-header">
            <div className="header-left">
              <h1><FaTrophy style={{ color: '#f59e0b', marginRight: 12 }} /> Create Pro Team</h1>
              <p>Build your ultimate fantasy XI with 11 <strong>YOUR</strong> players only 🔒</p>
            </div>
            <button className="btn-back-header" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back to Dashboard
            </button>
          </div>

          <div className="two-column-grid">
            {/* Left Column - Team Details */}
            <div>
              <div className="form-card">
                <div className="card-header-custom">
                  <h3><FaInfoCircle /> Team Details</h3>
                </div>
                <div className="card-body-custom">
                  {/* Logo Upload */}
                  <div className="form-group">
                    <label className="form-label"><FaUpload /> Team Logo</label>
                    <div className="logo-upload-area" onClick={() => document.getElementById('logoInput').click()}>
                      <FaUpload style={{ fontSize: 24, color: '#94a3b8' }} />
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Click to upload logo</p>
                      <input id="logoInput" type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                    </div>
                    {logoPreview && <img src={logoPreview} alt="Preview" className="logo-preview" />}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Team Name *</label>
                    <input type="text" className="form-control-custom" placeholder="Enter team name" value={teamInfo.name} onChange={(e) => setTeamInfo({...teamInfo, name: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label"><FaInfoCircle /> Short Name</label>
                    <input type="text" className="form-control-custom" placeholder="MI, CSK..." value={teamInfo.shortName} onChange={(e) => setTeamInfo({...teamInfo, shortName: e.target.value})} maxLength={10} />
                  </div>

                  <div className="form-group">
                    <label className="form-label"><FaUserTie /> Coach</label>
                    <input type="text" className="form-control-custom" placeholder="Ricky Ponting" value={teamInfo.coach} onChange={(e) => setTeamInfo({...teamInfo, coach: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-control-custom" placeholder="Tell about your team strategy..." value={teamInfo.description} onChange={(e) => setTeamInfo({...teamInfo, description: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label"><FaMapMarkerAlt /> Location</label>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>                      <input type="text" className="form-control-custom" placeholder="City" value={teamInfo.city} onChange={(e) => setTeamInfo({...teamInfo, city: e.target.value})} />
                      <select className="form-control-custom" value={teamInfo.state} onChange={(e) => setTeamInfo({...teamInfo, state: e.target.value})}>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Uttar Pradesh</option>
                        <option>Tamil Nadu</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Match & Lineup */}
            <div>
              {/* Match Selection */}
              <div className="form-card">
                <div className="card-header-custom">
                  <h3><FaCalendarAlt /> Select Match</h3>
                </div>
                <div className="card-body-custom">
                  <div className="match-selector-row">
                    <select className="match-type-select" value={matchType} onChange={(e) => setMatchType(e.target.value)}>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="recent">Recent</option>
                    </select>
                  </div>
                  <div className="matches-list">
                    {matches.map((match) => (
                      <button key={match._id} className={`match-item ${selectedMatch?._id === match._id ? 'selected' : ''}`} onClick={() => setSelectedMatch(match)}>
                        <div className="match-name">{match.team1?.name || 'Team1'} vs {match.team2?.name || 'Team2'}</div>
                        <div className="match-date">{match.date || 'Date TBD'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Search - YOUR PLAYERS ONLY */}
              <div className="form-card">
                <div className="card-header-custom" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <h3><FaSearch /> Your Players Only 🔒</h3>
                </div>
                <div className="card-body-custom">
                  <div className="search-wrapper">
                    <FaSearch className="search-icon-input" />
                    <input type="text" className="search-input-player" placeholder="Search YOUR players by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  {noPlayersMsg && (
                    <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', marginBottom: '12px', fontSize: '13px', color: '#92400e' }}>
                      ⚠️ {noPlayersMsg}
                    </div>
                  )}
                  <div className="players-list">
                    {players.slice(0, 12).map((player) => (
                      <div key={player._id || player.name} className="player-item">
                        <div className="player-info">
                          <h4>{player.name}</h4>
                          <span className="player-role-badge">{player.role}</span>
                          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>👤 Yours</div>
                        </div>
                        <button className="btn-add-player" onClick={() => addToTeam(player)}><FaPlus /> Add</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Lineup */}
              <div className="form-card">
                <div className="card-header-custom" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <h3><FaUsers /> Your Team Lineup ({team.filter(p => p).length}/11)</h3>
                </div>
                <div className="card-body-custom">
                  <div className="team-grid">
                    {team.map((player, index) => (
                      <div key={index} className={`player-slot ${player ? 'filled' : 'empty'}`}>
                        <div className="slot-number">#{index + 1}</div>
                        {player ? (
                          <>
                            {captain === player && <FaCrown className="captain-badge" />}
                            {viceCaptain === player && <FaStar className="vice-captain-badge" />}
                            <div className="player-name-slot">{player.name?.split(' ').slice(0, 2).join(' ')}</div>
                            <div className="player-role-slot">{player.role}</div>
                            <div className="slot-actions">
                              <button className="slot-btn slot-btn-captain" onClick={() => setCaptainHandler(player)}>C</button>
                              <button className="slot-btn slot-btn-vice" onClick={() => setViceCaptainHandler(player)}>VC</button>
                              <button className="slot-btn slot-btn-remove" onClick={() => removeFromTeam(index)}>×</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <FaPlus style={{ fontSize: 24, marginBottom: 8 }} />
                            <div>Slot {index + 1}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="btn-submit-team" onClick={handleSubmit} disabled={submitLoading || team.filter(p => p).length !== 11}>
                    {submitLoading ? <><div className="custom-spinner" style={{ width: 20, height: 20 }}></div> Creating...</> : <><FaCheckCircle /> Create Team</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTeam;

