import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../Services/teamService";
import { getMatches } from "../Services/matchService";
import { searchPlayers } from "../Services/playerService";
import PlayerCard from "../Components/HomeSection/PlayerCard";
import "../assets/Styles/Global.css";

function CreateTeam() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(Array(11).fill(null));
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchPlayers();
    }
  }, [searchQuery, selectedMatch]);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data.slice(0, 5)); // Top 5 matches
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const data = await searchPlayers(searchQuery);
      setPlayers(data);
    } catch (err) {
      console.error("Error searching players:", err);
    }
  };

  const addToTeam = (player, position) => {
    if (team[position - 1] || team.filter(Boolean).length >= 11) return;
    
    const newTeam = [...team];
    newTeam[position - 1] = player;
    setTeam(newTeam);
  };

  const removeFromTeam = (position) => {
    const newTeam = [...team];
    newTeam[position - 1] = null;
    setTeam(newTeam);
  };

  const handleSubmit = async () => {
    if (team.filter(Boolean).length !== 11 || !captain || !viceCaptain) {
      alert("Select 11 players with Captain and Vice-Captain");
      return;
    }

    try {
      setLoading(true);
      const teamData = {
        matchId: selectedMatch._id,
        players: team.map(p => p._id),
        captainId: captain._id,
        viceCaptainId: viceCaptain._id,
        name: `Team for ${selectedMatch.team1} vs ${selectedMatch.team2}`
      };

      await createTeam(teamData);
      alert("Team created successfully!");
      navigate("/my-teams");
    } catch (err) {
      console.error("Error creating team:", err);
      alert("Error creating team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Create New Team</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                {/* Step 1: Select Match */}
                <div className="p-4 border-bottom">
                  <label className="form-label fw-semibold text-gray-700 mb-3 d-block">
                    1. Select Match
                  </label>
                  <div className="row g-3">
                    {matches.map((match) => (
                      <div key={match._id} className="col-md-6">
                        <div 
                          className={`card hover-lift cursor-pointer p-3 ${selectedMatch?._id === match._id ? 'border-primary' : ''}`}
                          onClick={() => setSelectedMatch(match)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h6 className="fw-bold mb-1">{match.team1} vs {match.team2}</h6>
                              <small className="text-muted">{match.date} | {match.time}</small>
                            </div>
                            {selectedMatch?._id === match._id && (
                              <span className="badge bg-primary">Selected</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Search Players */}
                <div className="p-4 border-bottom">
                  <label className="form-label fw-semibold text-gray-700 mb-3 d-block">
                    2. Search & Add Players ({team.filter(Boolean).length}/11)
                  </label>
                  <div className="input-group mb-4">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search players..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="row g-3">
                    {players.slice(0, 12).map((player, index) => (
                      <div key={player._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 hover-lift border-0 shadow-sm">
                          <div className="card-body p-3">
                            <PlayerCard {...player} rank={index + 1} />
                            <button 
                              className="btn btn-primary w-100 mt-2"
                              onClick={() => addToTeam(player, team.filter(Boolean).length + 1)}
                            >
                              Add to Team
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3: Team Lineup */}
                <div className="p-4">
                  <label className="form-label fw-semibold text-gray-700 mb-3 d-block">
                    3. Team Lineup
                  </label>
                  <div className="row g-2 mb-4">
                    {team.map((player, index) => (
                      <div key={index} className="col-6 col-md-4 col-lg-2">
                        <div className={`position-relative p-3 rounded-2 border h-100 ${player ? 'border-primary bg-primary-subtle' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                          {player ? (
                            <div>
                              <small className="text-muted d-block mb-1">#{index + 1}</small>
                              <PlayerCard {...player} rank={index + 1} />
                              {(captain?._id === player._id || viceCaptain?._id === player._id) && (
                                <span className="position-absolute top-0 end-0 badge bg-success">
                                  {captain?._id === player._id ? 'C' : 'VC'}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-muted">
                              <small>Empty Slot</small>
                            </div>
                          )}
                          {player && (
                            <button 
                              className="btn btn-sm btn-outline-danger position-absolute top-0 start-0 m-1"
                              onClick={() => removeFromTeam(index)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Captain & Vice Captain */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Captain</label>
                      <select 
                        className="form-select" 
                        value={captain?._id || ''}
                        onChange={(e) => setCaptain(team[parseInt(e.target.value)])}
                      >
                        <option value="">Select Captain</option>
                        {team.filter(Boolean).map((player, index) => (
                          <option key={player._id} value={index}>
                            #{index + 1} {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Vice Captain</label>
                      <select 
                        className="form-select" 
                        value={viceCaptain?._id || ''}
                        onChange={(e) => setViceCaptain(team[parseInt(e.target.value)])}
                      >
                        <option value="">Select Vice Captain</option>
                        {team.filter(Boolean).map((player, index) => (
                          <option key={player._id} value={index}>
                            #{index + 1} {player.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-lg w-100" 
                    onClick={handleSubmit}
                    disabled={loading || team.filter(Boolean).length !== 11}
                  >
                    {loading ? 'Creating Team...' : 'Create Team & Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;
