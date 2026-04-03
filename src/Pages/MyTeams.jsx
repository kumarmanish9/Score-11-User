import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../Services/teamService';
import "../assets/Styles/Global.css";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [activeTab]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTeams(activeTab);
      setTeams(data || []);
    } catch (err) {
      setError('Failed to load teams');
      console.error(err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const mockTeams = [
    {
      id: 1,
      name: 'Kohli Smashers',
      match: 'RCB vs MI - Qualifier 1',
      status: 'Active',
      points: 156,
      players: 11,
      rank: 23,
      captain: 'Virat Kohli'
    },
    {
      id: 2,
      name: 'Bumrah Bombers',
      match: 'PBKS vs GT - Eliminator',
      status: 'Upcoming',
      points: 0,
      players: 11,
      rank: '-',
      captain: 'Jasprit Bumrah'
    },
    {
      id: 3,
      name: 'Pandya Power',
      match: 'CSK vs LSG - Match 65',
      status: 'Completed',
      points: 89,
      players: 11,
      rank: 156,
      captain: 'Hardik Pandya'
    },
    {
      id: 4,
      name: 'Dream Team',
      match: 'RR vs KKR - Match 67',
      status: 'Active',
      points: 134,
      players: 11,
      rank: 45,
      captain: 'Jos Buttler'
    }
  ];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading teams...</span>
        </div>
      </div>
    );
  }

  const filteredTeams = activeTab === 'all' ? mockTeams : mockTeams.filter(team => team.status.toLowerCase().includes(activeTab));

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-3">My Teams</h1>
            <p className="lead text-gray-700 mb-0">
              Manage your fantasy teams across all contests and matches.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/contests" className="btn btn-primary btn-lg px-5">
              Create New Team
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning text-center mb-5">
            {error} <button className="btn btn-sm btn-outline-primary ms-2" onClick={fetchTeams}>Retry</button>
          </div>
        )}

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group w-100" role="group">
              <button 
                className={`btn btn-lg fw-semibold flex-fill rounded-0 ${activeTab === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('active')}
              >
                Active ({mockTeams.filter(t => t.status === 'Active').length})
              </button>
              <button 
                className={`btn btn-lg fw-semibold flex-fill rounded-0 ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({mockTeams.filter(t => t.status === 'Upcoming').length})
              </button>
              <button 
                className={`btn btn-lg fw-semibold flex-fill rounded-end rounded-0 ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({mockTeams.filter(t => t.status === 'Completed').length})
              </button>
              <button 
                className={`btn btn-lg fw-semibold flex-fill rounded-0 ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('all')}
              >
                All ({mockTeams.length})
              </button>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="row g-4">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div key={team.id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 hover-lift border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title fw-bold mb-1">{team.name}</h5>
                        <small className="text-muted">{team.match}</small>
                      </div>
                      <span className={`badge fs-6 px-3 py-2 fw-semibold ${
                        team.status === 'Active' ? 'bg-success' : 
                        team.status === 'Upcoming' ? 'bg-warning text-dark' : 
                        'bg-secondary'
                      }`}>
                        {team.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="row text-center">
                        <div className="col-4">
                          <div className="h6 text-muted mb-1">Points</div>
                          <div className="h4 fw-bold text-primary">{team.points}</div>
                        </div>
                        <div className="col-4">
                          <div className="h6 text-muted mb-1">Players</div>
                          <div className="h5 text-success">{team.players}/11</div>
                        </div>
                        <div className="col-4">
                          <div className="h6 text-muted mb-1">Rank</div>
                          <div className="h5 fw-bold">{team.rank}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-3">
                      <small className="text-muted mb-2 d-block text-center">Captain</small>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px', fontSize: '12px'}}>
                          VK
                        </div>
                        <span className="fw-semibold">{team.captain}</span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Link to={`/teams/${team.id}`} className="btn btn-primary fw-semibold">
                        Edit Team
                      </Link>
                      <Link to={`/matches/${team.match.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="btn btn-outline-primary fw-semibold">
                        View Match
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-8">
              <div className="display-4 text-muted mb-4 opacity-25">
                <FaUsers size={120} />
              </div>
              <h3 className="mb-3">No teams yet</h3>
              <p className="text-muted mb-5 lead">Create your first fantasy team and start winning!</p>
              <Link to="/contests" className="btn btn-primary btn-lg px-5">
                Create Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTeams;

