import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaShare, FaMedal, FaChartLine, FaTable, FaList, FaStar, FaCrown, FaFire } from "react-icons/fa";
import { getTournamentById } from "../Services/tournamentService";
import { getMatches } from "../Services/matchService";
import MatchCard from "../Components/MatchesSection/MatchCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .tournament-page-container {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Hero Card */
  .tournament-hero-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 30px;
    overflow: hidden;
    margin-bottom: 30px;
    position: relative;
  }

  .tournament-hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .hero-content {
    padding: 35px;
    position: relative;
    z-index: 1;
  }

  .status-badge-large {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
  }

  .status-ongoing {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }

  .status-upcoming {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }

  .status-completed {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
  }

  .tournament-title {
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
  }

  .tournament-location {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tournament-date {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .btn-join-hero {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 12px 28px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-join-hero:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
  }

  .btn-share-hero {
    background: rgba(255,255,255,0.1);
    color: white;
    padding: 12px 28px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-share-hero:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  /* Stats Row */
  .stats-row-custom {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card-custom {
    background: white;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .stat-card-custom:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .stat-icon-custom {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .stat-value-custom {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label-custom {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  /* Tabs */
  .tabs-container {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .tabs-group {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
  }

  .tab-btn {
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    background: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }

  .tab-btn.active .tab-count {
    background: rgba(255,255,255,0.2);
    color: white;
  }

  .tab-btn:hover:not(.active) {
    background: #f1f5f9;
    color: #1e293b;
  }

  .tab-count {
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    color: #475569;
  }

  /* Content Card */
  .content-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  .card-header-custom {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 20px 24px;
    color: white;
  }

  .card-header-custom h3 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-body-custom {
    padding: 24px;
  }

  /* Filter Buttons */
  .filter-group {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    border: 2px solid #e2e8f0;
    background: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-color: #3b82f6;
    color: white;
  }

  /* Table Styles */
  .table-responsive-custom {
    overflow-x: auto;
  }

  .custom-table {
    width: 100%;
    border-collapse: collapse;
  }

  .custom-table thead {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: white;
  }

  .custom-table th {
    padding: 14px 16px;
    font-size: 13px;
    font-weight: 700;
    text-align: left;
  }

  .custom-table td {
    padding: 12px 16px;
    font-size: 14px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
  }

  .custom-table tr:hover td {
    background: #f8fafc;
  }

  .rank-badge {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 10px;
    text-align: center;
    line-height: 30px;
    font-weight: 800;
    font-size: 13px;
    color: white;
  }

  .rank-badge.top-1 {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
  }

  .rank-badge.top-2 {
    background: linear-gradient(135deg, #94a3b8, #64748b);
  }

  .rank-badge.top-3 {
    background: linear-gradient(135deg, #cd9a5b, #b87333);
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

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
  }

  /* Responsive */
  @media (max-width: 992px) {
    .stats-row-custom {
      grid-template-columns: repeat(2, 1fr);
    }
    .tabs-group {
      grid-template-columns: repeat(5, 1fr);
    }
    .tab-btn {
      font-size: 12px;
      padding: 12px 8px;
    }
  }

  @media (max-width: 768px) {
    .tournament-page-container {
      padding: 20px 0;
    }
    .hero-content {
      padding: 24px;
    }
    .tournament-title {
      font-size: 24px;
    }
    .stats-row-custom {
      gap: 12px;
    }
    .stat-card-custom {
      padding: 16px;
    }
    .stat-value-custom {
      font-size: 20px;
    }
    .tabs-group {
      grid-template-columns: repeat(5, 1fr);
    }
    .tab-btn span:first-child {
      display: none;
    }
    .filter-group {
      gap: 8px;
    }
    .filter-btn {
      padding: 6px 14px;
      font-size: 12px;
    }
  }
`;

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
        setLeaderboard(tournament?.leaderboard || [
          { rank: 1, name: "Mumbai Indians", points: 150, matches: 8, won: 6 },
          { rank: 2, name: "Chennai Super Kings", points: 140, matches: 8, won: 5 },
          { rank: 3, name: "Royal Challengers", points: 130, matches: 8, won: 5 },
          { rank: 4, name: "Delhi Capitals", points: 120, matches: 8, won: 4 },
          { rank: 5, name: "Kolkata Knight Riders", points: 110, matches: 8, won: 4 },
        ]);
      }
    } catch (err) {
      console.error("Error loading tab data:", err);
    } finally {
      setTabLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'ongoing') return 'status-ongoing';
    if (statusLower === 'upcoming') return 'status-upcoming';
    if (statusLower === 'completed') return 'status-completed';
    return 'status-upcoming';
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'ongoing') return 'Ongoing';
    if (statusLower === 'upcoming') return 'Upcoming';
    if (statusLower === 'completed') return 'Completed';
    return status || 'Upcoming';
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'top-1';
    if (rank === 2) return 'top-2';
    if (rank === 3) return 'top-3';
    return '';
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading tournament details...</p>
        </div>
      </>
    );
  }

  if (!tournament) {
    return (
      <>
        <style>{styles}</style>
        <div className="tournament-page-container">
          <div className="container text-center py-5">
            <h3>Tournament not found</h3>
            <button className="btn-back mt-3" onClick={() => navigate('/tournaments')}>
              Back to Tournaments
            </button>
          </div>
        </div>
      </>
    );
  }

const tabs = [ { id: "matches", label: "Matches", icon: <FaList />, count: tournament.matches?.length || matches.length },  { id: "leaderboard", label: "Leaderboard", icon: <FaMedal />, count: leaderboard.length }, { id: "points", label: "Points Table", icon: <FaTable />, count: 11 }, { id: "teams", label: "Teams", icon: <FaUsers />, count: tournament.teams?.length || 0 },  { id: "stats", label: "Stats", icon: <FaChartLine />, count: "-" },];

  const filteredMatches = matches.filter(match => {
    if (filterTab === "all") return true;
    if (filterTab === "live") return match.status === "live";
    if (filterTab === "upcoming") return match.status === "upcoming";
    if (filterTab === "completed") return match.status === "completed";
    return true;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="tournament-page-container">
        <div className="container">
          {/* Hero Card */}
          <div className="tournament-hero-card">
            <div className="hero-content">
              <div className={`status-badge-large ${getStatusClass(tournament.status)}`}>
                {getStatusText(tournament.status)}
              </div>
              <h1 className="tournament-title">{tournament.name}</h1>
              <div className="tournament-location">
                <FaMapMarkerAlt /> {tournament.location || "Cricket Stadium"}
              </div>
              <div className="tournament-date">
                <FaCalendarAlt /> 
                {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - 
                {new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="hero-actions">
                <button className="btn-join-hero">
                  <FaTrophy /> Join Tournament
                </button>
                <button className="btn-share-hero">
                  <FaShare /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row-custom">
            <div className="stat-card-custom">
              <div className="stat-icon-custom">🏆</div>
              <div className="stat-value-custom">{tournament.matches?.length || 0}</div>
              <div className="stat-label-custom">Total Matches</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">👥</div>
              <div className="stat-value-custom">{tournament.teams?.length || 0}</div>
              <div className="stat-label-custom">Teams</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">⭐</div>
              <div className="stat-value-custom">{tournament.views || 0}</div>
              <div className="stat-label-custom">Total Views</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">🎯</div>
              <div className="stat-value-custom">{tournament.prize || "10K"}</div>
              <div className="stat-label-custom">Prize Pool</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-group">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="tab-count">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="content-card">
            <div className="card-header-custom">
              <h3>
                {tabs.find(t => t.id === activeTab)?.icon}
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
            </div>
            <div className="card-body-custom">
              {tabLoading ? (
                <div className="text-center py-5">
                  <div className="custom-spinner" style={{ width: 40, height: 40 }}></div>
                  <p className="mt-3 text-muted">Loading...</p>
                </div>
              ) : activeTab === "matches" ? (
                <div>
                  <div className="filter-group">
                    {["all", "live", "upcoming", "completed"].map(ft => (
                      <button 
                        key={ft} 
                        className={`filter-btn ${filterTab === ft ? 'active' : ''}`}
                        onClick={() => setFilterTab(ft)}
                      >
                        {ft.charAt(0).toUpperCase() + ft.slice(1)}
                      </button>
                    ))}
                  </div>
                  {filteredMatches.length === 0 ? (
                    <div className="empty-state">
<FaList size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                      <p>No matches found</p>
                    </div>
                  ) : (
                    filteredMatches.map(match => (
                      <MatchCard key={match._id} match={match} className="mb-3" />
                    ))
                  )}
                </div>
              ) : activeTab === "leaderboard" ? (
                <div className="table-responsive-custom">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Team / Player</th>
                        <th>Points</th>
                        <th>Matches</th>
                        <th>Won</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className={`rank-badge ${getRankClass(item.rank || index + 1)}`}>
                              {item.rank || index + 1}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{item.name || item.teamName}</td>
                          <td><strong style={{ color: '#f59e0b' }}>{item.points}</strong></td>
                          <td>{item.matches || 8}</td>
                          <td>{item.won || Math.floor(item.points / 20)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === "points" ? (
                <div className="table-responsive-custom">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Played</th>
                        <th>Won</th>
                        <th>Lost</th>
                        <th>Points</th>
                        <th>NRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Mumbai Indians", played: 8, won: 6, lost: 2, points: 12, nrr: "+1.234" },
                        { name: "Chennai Super Kings", played: 8, won: 5, lost: 3, points: 10, nrr: "+0.876" },
                        { name: "Royal Challengers", played: 8, won: 5, lost: 3, points: 10, nrr: "+0.543" },
                        { name: "Delhi Capitals", played: 8, won: 4, lost: 4, points: 8, nrr: "-0.123" },
                        { name: "Kolkata Knight Riders", played: 8, won: 4, lost: 4, points: 8, nrr: "-0.234" },
                        { name: "Rajasthan Royals", played: 8, won: 3, lost: 5, points: 6, nrr: "-0.456" },
                        { name: "Punjab Kings", played: 8, won: 2, lost: 6, points: 4, nrr: "-0.789" },
                        { name: "Sunrisers Hyderabad", played: 8, won: 2, lost: 6, points: 4, nrr: "-1.012" },
                      ].map((team, i) => (
                        <tr key={i}>
                          <td><div className={`rank-badge ${getRankClass(i + 1)}`}>{i + 1}</div></td>
                          <td style={{ fontWeight: 700 }}>{team.name}</td>
                          <td>{team.played}</td>
                          <td style={{ color: '#10b981' }}>{team.won}</td>
                          <td style={{ color: '#ef4444' }}>{team.lost}</td>
                          <td><strong>{team.points}</strong></td>
                          <td>{team.nrr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === "teams" ? (
                <div className="empty-state">
                  <FaUsers size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <p>Teams list coming soon</p>
                </div>
              ) : (
                <div className="empty-state">
                  <FaChartLine size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <p>Statistics coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentPage;