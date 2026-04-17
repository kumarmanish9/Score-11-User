import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam, uploadTeamLogo, getUserTeams } from "../Services/teamService";
import { getMatches, getMatchDetails } from "../Services/matchService";
import { searchPlayers } from "../Services/playerService";

import "../assets/Styles/Global.css";

function CreateTeam() {
  const navigate = useNavigate();

  // Team Info State
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

  // Existing states
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

  // Player categories (fantasy standard)
  const categories = {
    1: {name: 'WicketKeepers', count: 1, max: 4, color: 'bg-yellow-500'},
    3: {name: 'Batsmen', count: 0, max: 6, color: 'bg-green-500'},
    4: {name: 'AllRounders', count: 0, max: 4, color: 'bg-purple-500'},
    2: {name: 'Bowlers', count: 0, max: 6, color: 'bg-red-500'}
  };

  // Normalize Player
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

  // Fetch Matches
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

  // Load Match Players
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

  // Search Players
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

      const apiData = await searchPlayers(query);
      const normalizedAPI = (apiData || []).map(normalizePlayer);

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
      console.error("Error searching players:", err);
    }
  };

  // Add to Team
  const addToTeam = (player) => {
    if (!player || !player._id) return;

    if (team.some((p) => p && p._id === player._id)) return;

    const firstEmpty = team.findIndex((p) => !p);
    if (firstEmpty === -1) return;

    const newTeam = [...team];
    newTeam[firstEmpty] = player;
    setTeam(newTeam);
  };

  // Remove from Team
  const removeFromTeam = (position) => {
    const newTeam = [...team];
    newTeam[position - 1] = null;
    setTeam(newTeam);
  };

  // Logo Upload Preview
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

  // Submit Team
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

      // Upload logo if selected
      if (logoFile && newTeamId) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await uploadTeamLogo(newTeamId, formData);
      }

      alert("Team created successfully! Check your teams list →");
      navigate("/teams?refresh=1");
    } catch (err) {
      console.error("Error:", err);
      alert(err?.response?.data?.message || "Error creating team");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Set Captain/VC
  const setCaptainHandler = (player) => setCaptain(player);
  const setViceCaptainHandler = (player) => setViceCaptain(player);

  return (
    <div className="min-vh-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6">
      <div className="container-xl px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11 col-xl-10">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h1 className="display-5 fw-bold text-dark mb-2">Create Pro Team</h1>
                <p className="lead text-muted mb-0">Build your ultimate fantasy XI</p>
              </div>
              <button 
                className="btn btn-outline-secondary btn-lg px-4 py-2"
                onClick={() => navigate(-1)}
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="row g-5">
              {/* Team Info Form */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg h-100 bg-white/80 backdrop-blur-sm">
                  <div className="card-body p-5">
                    <h3 className="h5 fw-bold mb-4 text-dark">
                      <i className="fas fa-crown me-2 text-warning"></i>
                      Team Details
                    </h3>

                    {/* Logo Upload */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted mb-2 d-block">
                        Team Logo
                      </label>
                      <div className="position-relative">
                        <input 
                          type="file" 
                          className="form-control" 
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                        {logoPreview && (
                          <img 
                            src={logoPreview} 
                            alt="Preview" 
                            className="mt-2 rounded shadow-sm w-100" 
                            style={{height: '120px', objectFit: 'cover'}}
                          />
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">Team Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-lg shadow-sm"
                        placeholder="Enter team name"
                        value={teamInfo.name}
                        onChange={(e) => setTeamInfo({...teamInfo, name: e.target.value})}
                        maxLength={100}
                      />
                    </div>

                    {/* Short Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-muted">Short Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MI, CSK..."
                        value={teamInfo.shortName}
                        onChange={(e) => setTeamInfo({...teamInfo, shortName: e.target.value})}
                        maxLength={10}
                      />
                    </div>

                    {/* Coach */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-muted">Coach</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ricky Ponting"
                        value={teamInfo.coach}
                        onChange={(e) => setTeamInfo({...teamInfo, coach: e.target.value})}
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-muted">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell about your team strategy..."
                        value={teamInfo.description}
                        onChange={(e) => setTeamInfo({...teamInfo, description: e.target.value})}
                        maxLength={1000}
                      />
                    </div>

                    {/* Location */}
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label fw-semibold text-muted small d-block mb-1">City</label>
                        <input type="text" className="form-control form-control-sm" value={teamInfo.city} onChange={(e) => setTeamInfo({...teamInfo, city: e.target.value})} />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold text-muted small d-block mb-1">State</label>
                        <select className="form-select form-select-sm" value={teamInfo.state} onChange={(e) => setTeamInfo({...teamInfo, state: e.target.value})}>
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

              {/* Match & Lineup */}
              <div className="col-lg-8">
                {/* Match Selector */}
                <div className="card border-0 shadow-lg mb-4 bg-white/80 backdrop-blur-sm">
                  <div className="card-body p-5">
                    <h5 className="fw-bold mb-3">
                      <i className="fas fa-calendar-alt me-2 text-info"></i>
                      Select Match
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <select 
                          className="form-select form-select-lg"
                          value={matchType}
                          onChange={(e) => setMatchType(e.target.value)}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="live">Live</option>
                          <option value="recent">Recent</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        {matches.map((match) => (
                          <button
                            key={match._id}
                            className={`btn w-100 p-3 mb-2 shadow-sm border-0 rounded-3 text-start ${
                              selectedMatch?._id === match._id 
                                ? 'btn-primary bg-gradient text-white' 
                                : 'btn-outline-primary'
                            }`}
                            onClick={() => setSelectedMatch(match)}
                          >
                            <strong>{match.team1?.name || 'Team1'} vs {match.team2?.name || 'Team2'}</strong>
                            <small className="d-block">{match.date || 'Soon'}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Search */}
                <div className="card border-0 shadow-lg mb-4 bg-white/80 backdrop-blur-sm">
                  <div className="card-body p-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0 shadow-none"
                        placeholder="Search players by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="mt-3">
                      {players.slice(0, 12).map((player) => (
                        <div key={player._id || player.name} className="p-2 border-bottom player-item hover-bg">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{player.name}</strong>
                              <small className="d-block text-muted badge bg-secondary">{player.role}</small>
                            </div>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => addToTeam(player)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Lineup */}
                <div className="card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <div className="card-body p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">
                        <i className="fas fa-list-ol me-2 text-success"></i>
                        Your Team Lineup ({team.filter(p => p).length}/11)
                      </h5>
                      <button 
                        className="btn btn-success btn-lg px-4"
                        onClick={handleSubmit}
                        disabled={submitLoading || team.filter(p => p).length !== 11}
                      >
                        {submitLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating...
                          </>
                        ) : (
                          'Create Team'
                        )}
                      </button>
                    </div>

                    <div className="row g-3">
                      {team.map((player, index) => (
                        <div key={index} className="col-md-6 col-lg-4 col-xl-3">
                          <div className={`player-slot p-3 rounded-3 shadow-sm border position-relative ${player ? 'bg-gradient-primary text-white' : 'bg-light border-dashed'}`}>
                            {player ? (
                              <>
                                <i 
                                  className={`fas fa-crown position-absolute top-0 end-0 p-2 ${captain === player ? 'text-yellow-400' : 'd-none'}`} 
                                  title="Captain"
                                ></i>
                                <i 
                                  className={`fas fa-star position-absolute top-0 start-0 p-2 ${viceCaptain === player ? 'text-amber-400' : 'd-none'}`} 
                                  title="Vice Captain"
                                ></i>
                                <div className="text-center">
                                  <div className="fw-bold mb-1">{player.name}</div>
                                  <small className="badge bg-light text-dark">{player.role}</small>
                                </div>
                                <div className="mt-2">
                                  <button 
                                    className="btn btn-sm btn-warning me-1"
                                    onClick={() => setCaptainHandler(player)}
                                  >
                                    C
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-info text-white"
                                    onClick={() => setViceCaptainHandler(player)}
                                  >
                                    VC
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-light ms-1"
                                    onClick={() => removeFromTeam(index + 1)}
                                  >
                                    ×
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted py-4">
                                <i className="fas fa-plus-circle fa-2x mb-2"></i>
                                <small>Slot {index + 1}</small>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
        .hover-bg:hover { background-color: #f8f9fa !important; }
        .player-slot { min-height: 140px; transition: all 0.3s ease; }
        .player-slot:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important; }
        @media (max-width: 768px) { .player-slot { min-height: 120px; } }
      `}</style>
    </div>
  );
}

export default CreateTeam;

