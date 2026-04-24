import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getUserTeams } from "../Services/teamService";
import {
  FaUsers,
  FaPlus,
  FaEye,
  FaSearch,
  FaSyncAlt,
  FaTrophy,
  FaChartLine,
  FaCrown,
  FaUser,
  FaCalendarAlt
} from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .team-list-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Header Section */
  .header-section {
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .team-count {
    background: #e2e8f0;
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
  }

  /* Action Buttons */
  .action-group {
    display: flex;
    gap: 12px;
  }

  .btn-refresh {
    background: white;
    color: #475569;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .btn-refresh:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .btn-create {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 10px 24px;
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

  .btn-create:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }

  /* Search Box */
  .search-container {
    margin-bottom: 30px;
  }

  .search-wrapper {
    position: relative;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 16px;
  }

  .search-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    background: white;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  /* Teams Grid */
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
  }

  /* Team Card */
  .team-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    position: relative;
  }

  .team-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  }

  /* Status Badge */
  .status-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 1;
  }

  .status-active {
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

  /* Card Content */
  .card-content {
    padding: 24px;
  }

  /* Team Name Row */
  .team-name-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .team-name {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
    line-height: 1.3;
  }

  /* Match Info */
  .match-info {
    background: #f8fafc;
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 20px;
  }

  .match-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .match-name {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  /* Stats Row */
  .stats-row-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card-list {
    background: #f8fafc;
    border-radius: 14px;
    padding: 12px;
    text-align: center;
  }

  .stat-value-list {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
  }

  .stat-label-list {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    margin-top: 4px;
  }

  /* Captain Section */
  .captain-section {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 14px;
    padding: 12px;
    text-align: center;
    margin-bottom: 20px;
  }

  .captain-icon {
    color: #f59e0b;
    font-size: 14px;
    margin-right: 6px;
  }

  .captain-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #92400e;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .captain-name {
    font-size: 14px;
    font-weight: 800;
    color: #78350f;
  }

  /* View Button */
  .btn-view-team {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-view-team:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
    color: white;
  }

  /* Error Alert */
  .error-alert {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .error-message {
    color: #dc2626;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-retry {
    background: #dc2626;
    color: white;
    padding: 8px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-retry:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 24px;
  }

  .empty-icon {
    font-size: 64px;
    color: #cbd5e1;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 24px;
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
  @media (max-width: 768px) {
    .team-list-page {
      padding: 20px 0;
    }
    .page-title {
      font-size: 24px;
    }
    .header-section {
      flex-direction: column;
      gap: 16px;
    }
    .action-group {
      width: 100%;
      justify-content: stretch;
    }
    .btn-refresh, .btn-create {
      flex: 1;
      justify-content: center;
    }
    .teams-grid {
      grid-template-columns: 1fr;
    }
    .search-wrapper {
      max-width: 100%;
    }
  }
`;

const TeamList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadTeams();
  }, [user]);

  useEffect(() => {
    if (searchParams.get('refresh')) {
      loadTeams();
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('refresh');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = user ? await getUserTeams() : [];
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "active") return "status-active";
    if (statusLower === "upcoming") return "status-upcoming";
    return "status-completed";
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "active") return "Active";
    if (statusLower === "upcoming") return "Upcoming";
    return status || "Active";
  };

  const filteredTeams = (teams || []).filter((team) =>
    team.name?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="team-list-page">
        <div className="container">
          {/* Header Section */}
          <div className="header-section d-flex flex-wrap justify-content-between align-items-center">
            <div className="page-title">
              <FaUsers />
              My Teams
              <span className="team-count">{filteredTeams.length}</span>
            </div>
            <div className="action-group">
              <button className="btn-refresh" onClick={loadTeams} title="Refresh">
                <FaSyncAlt /> Refresh
              </button>
              <button className="btn-create" onClick={() => navigate("/create-team")}>
                <FaPlus /> Create Team
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="error-message">
                ⚠️ {error}
              </div>
              <button className="btn-retry" onClick={loadTeams}>
                Retry
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="search-container">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search teams by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaUsers />
              </div>
              <h3 className="empty-title">
                {search ? "No matching teams found" : "No teams yet"}
              </h3>
              <p className="empty-text">
                {search 
                  ? `No teams match "${search}". Try a different search term.`
                  : "Create your first team to start your fantasy journey!"}
              </p>
              {!search && (
                <button className="btn-create" onClick={() => navigate("/create-team")}>
                  <FaPlus /> Create Your First Team
                </button>
              )}
            </div>
          ) : (
            <div className="teams-grid">
              {filteredTeams.map((team) => (
                <div key={team._id} className="team-card">
                  <div className={`status-badge ${getStatusClass(team.status)}`}>
                    {getStatusText(team.status)}
                  </div>
                  
                  <div className="card-content">
                    <div className="team-name-row">
                      <h3 className="team-name">{team.name}</h3>
                    </div>

                    <div className="match-info">
                      <div className="match-label">
                        <FaCalendarAlt style={{ fontSize: 10, marginRight: 4 }} />
                        MATCH
                      </div>
                      <div className="match-name">
                        {team.match?.name || "Fantasy Match"}
                      </div>
                    </div>

                    <div className="stats-row-list">
                      <div className="stat-card-list">
                        <div className="stat-value-list">{team.points || 0}</div>
                        <div className="stat-label-list">Total Points</div>
                      </div>
                      <div className="stat-card-list">
                        <div className="stat-value-list">{team.players?.length || 0}/25</div>
                        <div className="stat-label-list">Players</div>
                      </div>
                    </div>

                    <div className="captain-section">
                      <div className="captain-label">
                        <FaCrown className="captain-icon" /> CAPTAIN
                      </div>
                      <div className="captain-name">
                        {team.captain?.playerName || team.captain?.name || "Not selected"}
                      </div>
                    </div>

                    <Link to={`/teams/${team._id}`} className="btn-view-team">
                      <FaEye /> View Team Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamList;