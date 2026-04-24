import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserTeams } from "../Services/teamService";
import {
  FaTrophy,
  FaChartLine,
  FaCalendar,
  FaUsers,
  FaStar,
  FaFire,
  FaMedal,
  FaCrown,
  FaArrowRight,
  FaPlus,
  FaSyncAlt,
  FaEye
} from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .team-history-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    margin-bottom: 50px;
  }

  .hero-icon {
    font-size: 48px;
    color: #f59e0b;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 42px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .hero-subtitle {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 30px;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label {
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
    grid-template-columns: repeat(4, 1fr);
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
    text-transform: capitalize;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }

  .tab-btn:hover:not(.active) {
    background: #f1f5f9;
    color: #1e293b;
  }

  /* Teams Grid */
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
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

  .card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .team-info {
    flex: 1;
  }

  .team-name {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 6px;
  }

  .team-logo-small {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
  }

  /* Match Info Box */
  .match-info-box {
    background: #f8fafc;
    border-radius: 16px;
    padding: 14px;
    margin-bottom: 20px;
  }

  .match-date {
    font-size: 12px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
  }

  .match-name {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    text-align: center;
  }

  .stat-item {
    background: #f8fafc;
    padding: 12px 8px;
    border-radius: 14px;
  }

  .stat-number {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
  }

  .stat-label-small {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    margin-top: 4px;
  }

  /* Captain Box */
  .captain-box {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 14px;
    padding: 12px;
    text-align: center;
    margin-bottom: 20px;
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

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 12px;
  }

  .btn-view {
    flex: 1;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-view:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    color: white;
  }

  .btn-edit-small {
    flex: 1;
    background: #f1f5f9;
    color: #475569;
    padding: 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-edit-small:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  /* Create Team Button */
  .btn-create-team {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 14px 32px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 800;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }

  .btn-create-team:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
    color: white;
  }

  /* Refresh Button */
  .btn-refresh {
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
    margin-left: 12px;
  }

  .btn-refresh:hover {
    background: #f8fafc;
    transform: translateY(-2px);
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
  @media (max-width: 992px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .teams-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .team-history-page {
      padding: 20px 0;
    }
    .hero-title {
      font-size: 28px;
    }
    .stats-grid {
      gap: 12px;
    }
    .stat-card {
      padding: 16px;
    }
    .stat-value {
      font-size: 24px;
    }
    .tabs-group {
      grid-template-columns: repeat(4, 1fr);
    }
    .tab-btn {
      padding: 12px 8px;
      font-size: 12px;
    }
    .action-buttons {
      flex-direction: column;
    }
  }
`;

function TeamHistory() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await getUserTeams();
      const sortedTeams = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTeams(sortedTeams);
      
      // Calculate stats
      const totalTeams = sortedTeams.length;
      const activeTeams = sortedTeams.filter(t => t.status === 'Active' || t.status === 'active').length;
      const winRate = sortedTeams.length > 0 ? Math.round((sortedTeams.filter(t => t.points > 50).length / totalTeams) * 100) : 0;
      
      setStats({ 
        totalTeams, 
        activeTeams, 
        winRate, 
        avgPoints: sortedTeams.reduce((sum, t) => sum + (t.points || 0), 0) / totalTeams || 0 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      default: return 'status-active';
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return status || 'Active';
    }
  };

  const filteredTeams = teams.filter(team => 
    activeTab === "all" || team.status?.toLowerCase() === activeTab
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
      <div className="team-history-page">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-icon">
              <FaTrophy />
            </div>
            <h1 className="hero-title">Team History</h1>
            <p className="hero-subtitle">Track all your teams, points & performance across contests</p>
            <div>
              <Link to="/create-team" className="btn-create-team">
                <FaPlus /> Create New Team
              </Link>
              <button onClick={fetchTeams} className="btn-refresh">
                <FaSyncAlt /> Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.totalTeams || 0}</div>
              <div className="stat-label">Total Teams</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.winRate}%</div>
              <div className="stat-label">Win Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{stats.avgPoints?.toFixed(0) || 0}</div>
              <div className="stat-label">Avg Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{stats.activeTeams || 0}</div>
              <div className="stat-label">Active Teams</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-group">
              {['all', 'active', 'upcoming', 'completed'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                  <span style={{ marginLeft: 6, opacity: 0.8 }}>
                    ({teams.filter(t => t.status?.toLowerCase() === tab).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Teams Grid */}
          {filteredTeams.length > 0 ? (
            <div className="teams-grid">
              {filteredTeams.map((team) => (
                <div key={team._id} className="team-card">
                  <div className={`status-badge ${getStatusClass(team.status)}`}>
                    {getStatusText(team.status)}
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header-row">
                      <div className="team-info">
                        <h3 className="team-name">{team.name}</h3>
                      </div>
                      {team.logo?.url && (
                        <img 
                          src={team.logo.url} 
                          className="team-logo-small"
                          alt={team.name}
                        />
                      )}
                    </div>

                    <div className="match-info-box">
                      <div className="match-date">
                        <FaCalendar /> {new Date(team.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="match-name">
                        {team.match?.name || 'Fantasy Match'}
                      </div>
                    </div>

                    <div className="stats-row">
                      <div className="stat-item">
                        <div className="stat-number">{team.points || 0}</div>
                        <div className="stat-label-small">Points</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">#{team.rank || '-'}</div>
                        <div className="stat-label-small">Rank</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{team.players?.length || 0}/25</div>
                        <div className="stat-label-small">Players</div>
                      </div>
                    </div>

                    {team.captain && (
                      <div className="captain-box">
                        <div className="captain-label">
                          <FaCrown style={{ fontSize: 10, marginRight: 4 }} /> CAPTAIN
                        </div>
                        <div className="captain-name">
                          {team.captain.playerName || team.captain.name}
                        </div>
                      </div>
                    )}

                    <div className="action-buttons">
                      <Link to={`/teams/${team._id}`} className="btn-view">
                        <FaEye /> View Details
                      </Link>
                      {team.status?.toLowerCase() === 'active' && (
                        <Link to={`/teams/${team._id}/edit`} className="btn-edit-small">
                          <FaStar /> Edit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FaTrophy />
              </div>
              <h3 className="empty-title">No Teams Found</h3>
              <p className="empty-text">
                {activeTab === 'all' 
                  ? "You haven't created any teams yet." 
                  : `No ${activeTab} teams in this category.`}
              </p>
              <Link to="/create-team" className="btn-create-team">
                <FaPlus /> Create Your First Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TeamHistory;