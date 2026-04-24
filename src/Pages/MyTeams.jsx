import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserTeams } from "../Services/teamService";
import { FaPlus, FaEdit, FaEye, FaTrophy, FaUsers, FaStar, FaCalendarAlt, FaChartLine, FaFilter, FaSearch, FaTrash } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .my-teams-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Header Section */
  .header-section {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 30px;
    padding: 40px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .header-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .page-title {
    font-size: 32px;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
  }

  .page-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
  }

  .create-team-btn {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    border: none;
    padding: 14px 28px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 16px;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .create-team-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    color: white;
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .stat-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  /* Search & Filter Bar */
  .search-filter-bar {
    background: white;
    border-radius: 20px;
    padding: 16px 24px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .search-box {
    flex: 1;
    max-width: 300px;
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 12px;
    padding: 10px 16px;
    gap: 10px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .search-box:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-input {
    border: none;
    background: none;
    outline: none;
    flex: 1;
    font-size: 14px;
    font-family: inherit;
  }

  /* Tabs */
  .tabs-container {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 12px 24px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    background: white;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .tab-btn:hover:not(.active) {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  .tab-count {
    background: rgba(0,0,0,0.1);
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 12px;
  }

  .tab-btn.active .tab-count {
    background: rgba(255,255,255,0.2);
  }

  /* Teams Grid */
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }

  /* Team Card */
  .team-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .team-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }

  .team-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    color: white;
    position: relative;
  }

  .team-name {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 8px;
    padding-right: 80px;
  }

  .team-match {
    font-size: 13px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 700;
  }

  .status-active {
    background: #10b981;
    color: white;
  }

  .status-upcoming {
    background: #f59e0b;
    color: white;
  }

  .status-completed {
    background: #6b7280;
    color: white;
  }

  .team-body {
    padding: 20px;
  }

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label-sm {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .stat-value-lg {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
  }

  .stat-value-lg.text-primary {
    color: #3b82f6;
  }

  .stat-value-lg.text-success {
    color: #10b981;
  }

  /* Captain Section */
  .captain-section {
    background: linear-gradient(135deg, #fef3c7, #fffbeb);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .captain-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #d97706;
    text-align: center;
    margin-bottom: 8px;
  }

  .captain-name {
    font-size: 16px;
    font-weight: 800;
    color: #92400e;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* Players Preview */
  .players-preview {
    margin-bottom: 20px;
  }

  .players-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .players-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .player-tag {
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #475569;
  }

  .player-tag.captain {
    background: #fef3c7;
    color: #d97706;
  }

  .player-tag.vice-captain {
    background: #e0e7ff;
    color: #4338ca;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 12px;
  }

  .btn-edit {
    flex: 1;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 12px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    color: white;
  }

  .btn-view {
    flex: 1;
    background: #f1f5f9;
    color: #475569;
    padding: 12px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-view:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 40px;
    background: white;
    border-radius: 30px;
  }

  .empty-icon {
    font-size: 80px;
    color: #cbd5e1;
    margin-bottom: 24px;
  }

  .empty-state h3 {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .empty-state p {
    color: #64748b;
    margin-bottom: 24px;
  }

  /* Loading */
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
  @media (max-width: 768px) {
    .my-teams-page {
      padding: 20px 0;
    }
    .header-section {
      padding: 24px;
    }
    .page-title {
      font-size: 24px;
    }
    .teams-grid {
      grid-template-columns: 1fr;
    }
    .search-filter-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .search-box {
      max-width: none;
    }
    .tabs-container {
      overflow-x: auto;
      flex-wrap: nowrap;
    }
    .tab-btn {
      white-space: nowrap;
    }
  }
`;

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTeams = () => {
    let filtered = teams || [];
    
    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(team => 
        team.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.match?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.captain?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredTeams = getFilteredTeams();

  const getTabCount = (status) => {
    if (status === "all") return teams.length;
    return teams.filter(t => t.status?.toLowerCase() === status.toLowerCase()).length;
  };

  const getTotalPoints = () => {
    return teams.reduce((sum, team) => sum + (team.points || 0), 0);
  };

  const getAverageRank = () => {
    const ranks = teams.filter(t => t.rank).map(t => t.rank);
    if (ranks.length === 0) return 0;
    return (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading your teams...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="my-teams-page">
        <div className="container">
          {/* Header Section */}
          <div className="header-section">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="page-title">My Teams</h1>
                <p className="page-subtitle">
                  Manage your fantasy teams, track performance, and join contests
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <Link to="/contests" className="create-team-btn">
                  <FaPlus /> Create New Team
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{teams.length}</div>
              <div className="stat-label">Total Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{getTotalPoints()}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{getAverageRank()}</div>
              <div className="stat-label">Avg. Rank</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">
                {teams.filter(t => t.status === "Active").length}
              </div>
              <div className="stat-label">Active Teams</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="search-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search teams by name, match, or captain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-warning text-center mb-4" style={{ borderRadius: 16 }}>
              {error}
              <button className="btn btn-sm btn-outline-primary ms-3" onClick={fetchTeams}>
                Retry
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs-container">
            {["all", "active", "upcoming", "completed"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="tab-count">{getTabCount(tab)}</span>
              </button>
            ))}
          </div>

          {/* Teams Grid */}
          {filteredTeams.length > 0 ? (
            <div className="teams-grid">
              {filteredTeams.map((team) => (
                <div key={team._id} className="team-card">
                  <div className="team-header">
                    <h5 className="team-name">{team.name}</h5>
                    <div className="team-match">
                      <FaCalendarAlt size={12} />
                      {team.match?.name || "Match Info"}
                    </div>
                    <span className={`status-badge status-${team.status?.toLowerCase()}`}>
                      {team.status || "Active"}
                    </span>
                  </div>
                  
                  <div className="team-body">
                    {/* Stats Row */}
                    <div className="stats-row">
                      <div className="stat-item">
                        <div className="stat-label-sm">Points</div>
                        <div className="stat-value-lg text-primary">
                          {team.points || 0}
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label-sm">Players</div>
                        <div className="stat-value-lg text-success">
                          {team.players?.length || 0}/11
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label-sm">Rank</div>
                        <div className="stat-value-lg">
                          {team.rank || "-"}
                        </div>
                      </div>
                    </div>

                    {/* Captain & Vice Captain */}
                    <div className="captain-section">
                      <div className="captain-label">
                        <FaStar /> Captain
                      </div>
                      <div className="captain-name">
                        {team.captain?.name || "Not Selected"}
                      </div>
                      {team.viceCaptain && (
                        <div className="mt-2 text-center">
                          <small className="text-muted">VC: {team.viceCaptain.name}</small>
                        </div>
                      )}
                    </div>

                    {/* Players Preview */}
                    {team.players && team.players.length > 0 && (
                      <div className="players-preview">
                        <div className="players-title">
                          <FaUsers size={12} /> Players ({team.players.length})
                        </div>
                        <div className="players-list">
                          {team.players.slice(0, 5).map((player, idx) => (
                            <span key={idx} className="player-tag">
                              {player.name?.split(" ")[0]}
                            </span>
                          ))}
                          {team.players.length > 5 && (
                            <span className="player-tag">+{team.players.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <Link to={`/teams/${team._id}`} className="btn-edit">
                        <FaEdit /> Edit Team
                      </Link>
                      <Link to={`/matches/${team.match?._id}`} className="btn-view">
                        <FaEye /> View Match
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                {searchTerm ? "🔍" : "👥"}
              </div>
              <h3>{searchTerm ? "No teams found" : "No teams yet"}</h3>
              <p>
                {searchTerm 
                  ? `No teams matching "${searchTerm}". Try a different search.`
                  : "Create your first fantasy team and start winning!"}
              </p>
              {searchTerm ? (
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              ) : (
                <Link to="/contests" className="btn btn-primary">
                  Create Your First Team
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyTeams;