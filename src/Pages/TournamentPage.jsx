import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTournamentById } from "../Services/tournamentService";
import { getMatches } from "../Services/matchService";
import MatchCard from "../Components/MatchesSection/MatchCard";
import "../assets/Styles/Global.css";

const TournamentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");
  const [filterTab, setFilterTab] = useState("all");
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    fetchTournament();
  }, [id]);

  useEffect(() => {
    if (tournament) {
      loadTabData(activeTab);
    }
  }, [activeTab, filterTab, tournament]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const data = await getTournamentById(id);
      setTournament(data);
    } catch (err) {
      console.error("Error fetching tournament:", err);
      alert("Tournament not found");
      navigate("/tournaments");
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    setTabLoading(true);
    try {
      if (tab === "matches") {
        const allMatches = await getMatches("all");
        const tournamentMatches = allMatches.filter(m => 
          m.tournamentId === id || 
          m.tournament?._id === id ||
          (m.tournament && m.tournament._id === id)
        );
        setMatches(tournamentMatches);
      } else if (tab === "leaderboard") {
        // Assume leaderboard service or use tournament.leaderboard
        setLeaderboard(tournament?.leaderboard || [
          { name: "Player 1", points: 150 },
          { name: "Player 2", points: 140 },
          { name: "Player 3", points: 130 },
        ]);
      }
      // Points table from tournament.points or leaderboard
    } catch (err) {
      console.error("Error loading tab data:", err);
    } finally {
      setTabLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border" /></div>;
  }

  if (!tournament) {
    return <div className="container py-5">Tournament not found</div>;
  }

  const tabs = [
    { id: "matches", label: "Matches", count: tournament.matches?.length || matches.length },
    { id: "leaderboard", label: "Leaderboard", count: leaderboard.length },
    { id: "points", label: "Points Table", count: 11 },
    { id: "teams", label: "Teams", count: tournament.teams?.length || 0 },
    { id: "stats", label: "Stats", count: "-" },
  ];

  return (
    <div className="min-vh-100 bg-gray-50 py-4">
      <div className="container">
        {/* Tournament Header */}
        <div className="card shadow-lg border-0 mb-4 overflow-hidden">
          <div className="p-4 bg-primary text-white position-relative">
            <div className="position-absolute top-0 end-0 p-3">
              <span className="badge bg-light text-dark fs-6">{tournament.status || "Ongoing"}</span>
            </div>
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="h3 mb-2 fw-bold">{tournament.name}</h1>
                <p className="mb-2">{tournament.location || "Cricket Stadium"} • {tournament.views || 0} Views</p>
                <p className="mb-3 opacity-75">
                  {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                </p>
                <button className="btn btn-light me-2">Join Tournament</button>
                <button className="btn btn-outline-light">Share</button>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="card bg-white text-dark border-0">
                      <div className="card-body p-3 text-center">
                        <h4>{tournament.matches?.length || 0}</h4>
                        <small>Matches</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-white text-dark border-0">
                      <div className="card-body p-3 text-center">
                        <h4>{tournament.teams?.length || 0}</h4>
                        <small>Teams</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body p-0">
            <div className="nav nav-pills nav-fill border-bottom">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  className={`nav-link px-4 py-3 flex-grow-1 ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label} <span className="badge bg-secondary ms-1">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            {tabLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2 text-muted">Loading...</p>
              </div>
            ) : activeTab === "matches" ? (
              <div>
                {/* Filter buttons */}
                <div className="btn-group mb-4 w-100" role="group">
                  {["all", "live", "upcoming", "completed"].map(ft => (
                    <button 
                      key={ft} 
                      className={`btn btn-outline-primary ${filterTab === ft ? 'active' : ''}`}
                      onClick={() => setFilterTab(ft)}
                    >
                      {ft.charAt(0).toUpperCase() + ft.slice(1)}
                    </button>
                  ))}
                </div>
                {matches.length === 0 ? (
                  <p className="text-muted text-center py-5">No matches found</p>
                ) : (
                  matches.map(match => (
                    <MatchCard key={match._id} match={match} className="mb-3" />
                  ))
                )}
              </div>
            ) : activeTab === "leaderboard" ? (
              <div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Matches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((player, index) => (
                        <tr key={index}>
                          <td>
                            <strong>#{index + 1}</strong>
                          </td>
                          <td>{player.name || player.teamName}</td>
                          <td><strong>{player.points}</strong></td>
                          <td>{player.matches || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "points" ? (
              <div>
                <h5>Points Table</h5>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Played</th>
                        <th>Won</th>
                        <th>Points</th>
                        <th>Net RR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(10)].map((_, i) => (
                        <tr key={i}>
                          <td>Player/Team {i+1}</td>
                          <td>{Math.floor(Math.random()*10)}</td>
                          <td>{Math.floor(Math.random()*8)}</td>
                          <td>{Math.floor(Math.random()*200)}</td>
                          <td>{(Math.random()*10).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "teams" ? (
              <p className="text-muted">Teams list coming soon (tournament.teams)</p>
            ) : (
              <p className="text-muted">Stats coming soon</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;
