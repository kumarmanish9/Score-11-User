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
  FaMedal
} from "react-icons/fa";
import "../assets/Styles/Global.css";

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
      const activeTeams = sortedTeams.filter(t => t.status === 'Active').length;
      const winRate = sortedTeams.length > 0 ? Math.round((sortedTeams.filter(t => t.points > 50).length / totalTeams) * 100) : 0;
      
      setStats({ totalTeams, activeTeams, winRate, avgPoints: sortedTeams.reduce((sum, t) => sum + (t.points || 0), 0) / totalTeams || 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => 
    activeTab === "all" || team.status?.toLowerCase() === activeTab
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-team py-5">
        <div className="spinner-border text-primary fs-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-team py-5">
      <div className="container-xl px-4">
        {/* Hero Header */}
        <div className="text-center mb-7">
          <h1 className="display-4 fw-bold text-white mb-4 animate-fade-in">
            <FaTrophy className="fs-1 me-3 text-warning mb-3 d-block" />
            Team History
          </h1>
          <p className="lead text-white-50 mb-5">Track all your teams, points & performance across contests</p>
          
          <Link to="/create-team" className="btn btn-lg btn-warning fw-bold px-6 py-3 shadow-lg">
            <FaFire className="me-2" />
            Create New Team
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-8">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg bg-white/20 backdrop-blur-xl text-center p-5 text-white">
              <FaUsers className="fs-1 text-info mb-3" />
              <div className="h3 fw-bold mb-1">{stats.totalTeams || 0}</div>
              <div className="text-white-50">Total Teams</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg bg-white/20 backdrop-blur-xl text-center p-5 text-white">
              <FaStar className="fs-1 text-warning mb-3" />
              <div className="h3 fw-bold mb-1">{stats.winRate}%</div>
              <div className="text-white-50">Win Rate</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg bg-white/20 backdrop-blur-xl text-center p-5 text-white">
              <FaChartLine className="fs-1 text-success mb-3" />
              <div className="h3 fw-bold mb-1">
                {stats.avgPoints?.toFixed(0) || 0}
              </div>
              <div className="text-white-50">Avg Points</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg bg-white/20 backdrop-blur-xl text-center p-5 text-white">
              <FaCalendar className="fs-1 text-primary mb-3" />
              <div className="h3 fw-bold mb-1">{stats.activeTeams || 0}</div>
              <div className="text-white-50">Active Teams</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card border-0 shadow-xl bg-white/30 backdrop-blur-xl mb-6">
          <div className="card-body p-0">
            <div className="btn-group w-100 rounded-0" role="group">
              {['all', 'active', 'upcoming', 'completed'].map(tab => (
                <button
                  key={tab}
                  className={`btn btn-lg fw-semibold flex-fill py-4 px-0 border-0 ${
                    activeTab === tab 
                      ? 'bg-gradient-primary text-white shadow-lg' 
                      : 'bg-transparent text-white-50 hover:bg-white/10 transition-all'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                  ({teams.filter(t => t.status?.toLowerCase() === tab).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Teams Timeline */}
        <div className="row g-4">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team, index) => (
              <div key={team._id} className="col-xl-4 col-lg-6 col-md-6">
                <div className="card border-0 shadow-xl h-100 bg-white/80 backdrop-blur-lg overflow-hidden transform-hover">
                  <div className="position-relative">
                    <div className={`timeline-badge position-absolute start-0 top-50 translate-middle-y ms-3 z-index-1 ${getStatusColor(team.status)}`}>
                      <div className="timeline-icon">
                        <i className={`fas ${getStatusIcon(team.status)}`}></i>
                      </div>
                    </div>
                    <div className="p-5 pt-8">
                      {/* Team Header */}
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                          <h5 className="fw-bold mb-1 lh-1">{team.name}</h5>
                          <small className="badge fs-6 px-3 py-2 fw-semibold rounded-pill bg-gradient-status">
                            {team.status || 'Active'}
                          </small>
                        </div>
                        {team.logo && (
                          <img 
                            src={team.logo.url} 
                            className="rounded-circle shadow-lg" 
                            style={{width: '60px', height: '60px', objectFit: 'cover'}}
                            alt={team.name}
                          />
                        )}
                      </div>

                      {/* Match Info */}
                      <div className="bg-light/50 p-3 rounded-3 mb-4">
                        <small className="text-muted mb-1 d-block">
                          <FaCalendar className="me-1" />
                          {new Date(team.createdAt).toLocaleDateString()}
                        </small>
                        <div className="fw-semibold text-truncate">
                          {team.match?.name || 'Fantasy Match'}
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="row text-center g-3 mb-4">
                        <div className="col-4">
                          <div className="fs-5 fw-bold text-primary">{team.points || 0}</div>
                          <small className="text-muted">Points</small>
                        </div>
                        <div className="col-4">
                          <div className="fs-5 fw-bold text-success">
                            #{team.rank || '-'}
                          </div>
                          <small className="text-muted">Rank</small>
                        </div>
                        <div className="col-4">
                          <div className="fs-5 fw-bold text-info">
                            {team.players?.length || 0}/11
                          </div>
                          <small className="text-muted">Players</small>
                        </div>
                      </div>

                      {/* Captain */}
                      {team.captain && (
                        <div className="bg-gradient-captain p-3 rounded-3 mb-4 text-center">
                          <FaMedal className="text-warning me-2 mb-2 d-block fs-4" />
                          <small className="text-white-50 d-block mb-1">Captain</small>
                          <div className="fw-bold text-white">{team.captain.name}</div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="d-grid gap-2">
                        <Link
                          to={`/match/${team.match?._id}`}
                          className="btn btn-primary fw-semibold py-3"
                        >
                          <FaChartLine className="me-2" />
                          View Match
                        </Link>
                        {team.status === 'Active' && (
                          <Link
                            to={`/edit-team/${team._id}`}
                            className="btn btn-outline-primary fw-semibold py-3"
                          >
                            Edit Team
                          </Link>
                        )}
                        <button
                          className="btn btn-outline-secondary py-3"
                          onClick={fetchTeams}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-10">
              <FaTrophy className="display-1 text-white-50 mb-4" />
              <h3 className="text-white mb-4">No teams in this category</h3>
              <p className="text-white-50 mb-5">Create your first team and start your journey!</p>
              <Link to="/create-team" className="btn btn-lg btn-warning fw-bold px-6 py-3 shadow-lg">
                Create First Team
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :global(.bg-gradient-team) {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
        }
        :global(.bg-gradient-primary) {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%) !important;
        }
        :global(.bg-gradient-status) {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        :global(.bg-gradient-captain) {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        :global(.timeline-badge) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :global(.status-active) { background: #10b981 !important; }
        :global(.status-upcoming) { background: #f59e0b !important; }
        :global(.status-completed) { background: #6b7280 !important; }
        :global(.transform-hover:hover) {
          transform: translateY(-8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        :global(.animate-fade-in) {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          :global(.timeline-badge) { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// Status helpers
const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': return 'status-active';
    case 'upcoming': return 'status-upcoming';
    case 'completed': return 'status-completed';
    default: return 'status-active';
  }
};

const getStatusIcon = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': return 'fa-play-circle';
    case 'upcoming': return 'fa-clock';
    case 'completed': return 'fa-check-circle';
    default: return 'fa-dot-circle';
  }
};

export default TeamHistory;

