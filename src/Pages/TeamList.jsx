import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getTeams, getUserTeams, createTeam } from '../Services/teamService';
import { FaUsers, FaPlus, FaEdit, FaEye, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import "../assets/Styles/Global.css";

const TeamList = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, public, private
  const [search, setSearch] = useState('');
  const [showUserTeams, setShowUserTeams] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const mockTeams = [
    {
      _id: '1',
      name: 'Kohli Smashers',
      match: 'RCB vs MI',
      contestName: 'Mega Contest',
      status: 'active',
      points: 156,
      rank: 23,
      players: 11,
      captainName: 'Virat Kohli',
      viceCaptainName: 'Faf du Plessis',
      isPublic: true
    },
    {
      _id: '2',
      name: 'Bumrah Bombers',
      match: 'PBKS vs GT',
      contestName: 'Head-to-Head',
      status: 'upcoming',
      points: 0,
      rank: '-',
      players: 11,
      captainName: 'Jasprit Bumrah',
      viceCaptainName: 'Shreyas Iyer',
      isPublic: false
    },
    {
      _id: '3',
      name: 'Pandya Power XI',
      match: 'CSK vs LSG',
      contestName: 'Small League',
      status: 'completed',
      points: 89,
      rank: 156,
      players: 11,
      captainName: 'Hardik Pandya',
      viceCaptainName: 'Rishabh Pant',
      isPublic: true
    },
    {
      _id: '4',
      name: 'Dream Warriors',
      match: 'RR vs KKR',
      contestName: 'Practice Contest',
      status: 'active',
      points: 134,
      rank: 45,
      players: 11,
      captainName: 'Jos Buttler',
      viceCaptainName: 'Yashasvi Jaiswal',
      isPublic: true
    },
    {
      _id: '5',
      name: 'Spin Masters',
      match: 'DC vs SRH',
      contestName: 'Grand League',
      status: 'upcoming',
      points: 0,
      rank: '-',
      players: 8,
      captainName: 'Kuldeep Yadav',
      viceCaptainName: 'Rashid Khan',
      isPublic: true
    },
    {
      _id: '6',
      name: 'Royal Challengers Pro',
      match: 'RCB vs CSK',
      contestName: 'Pro League',
      status: 'active',
      points: 201,
      rank: 1,
      players: 11,
      captainName: 'Virat Kohli',
      viceCaptainName: 'Glenn Maxwell',
      isPublic: true
    },
    {
      _id: '7',
      name: 'Mumbai Express',
      match: 'MI vs KKR',
      contestName: 'Express Contest',
      status: 'completed',
      points: 112,
      rank: 89,
      players: 11,
      captainName: 'Rohit Sharma',
      viceCaptainName: 'Ishan Kishan',
      isPublic: false
    },
    {
      _id: '8',
      name: 'Delhi Daredevils',
      match: 'DC vs PBKS',
      contestName: 'Dare Contest',
      status: 'upcoming',
      points: 0,
      rank: '-',
      players: 10,
      captainName: 'Axar Patel',
      viceCaptainName: 'Prithvi Shaw',
      isPublic: true
    }
  ];

  useEffect(() => {
    loadTeams();
  }, [user]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const [all, my] = await Promise.all([
        getTeams(),
        user ? getUserTeams() : Promise.resolve([])
      ]);
      setAllTeams(all || mockTeams);
      setUserTeams(my || mockTeams.slice(0,5));
    } catch (err) {
      console.log('API failed, using mock data');
      setAllTeams(mockTeams);
      setUserTeams(mockTeams.slice(0,5));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const newTeamData = {
        name: 'New Team #' + Date.now(),
        description: 'Your new fantasy team',
        players: [],
        isPublic: true,
        captain: null
      };
      const newTeam = await createTeam(newTeamData);
      setUserTeams([newTeam, ...userTeams]);
      alert('Team created successfully!');
    } catch (err) {
      // Mock create for demo
      const newMockTeam = {
        _id: 'mock' + Date.now(),
        name: 'Mock Team #' + Date.now(),
        match: 'Demo Match',
        status: 'active',
        points: 0,
        rank: userTeams.length + 1,
        players: 0,
        captainName: 'Captain',
        viceCaptainName: 'VC',
        isPublic: true
      };
      setUserTeams([newMockTeam, ...userTeams]);
      alert('Demo team created!');
    }
  };

  const filteredTeams = showUserTeams ? userTeams.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || team.isPublic === (filter === 'public'))
  ) : allTeams.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || team.isPublic === (filter === 'public'))
  );

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      upcoming: 'badge-warning text-dark',
      completed: 'badge-secondary'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-90 bg-gray-50 p-5">
        <div className="spinner-border text-primary pulse-animation" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-offwhite">
      <div className="container">
        {/* Header */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <FaUsers className="fs-1 text-primary" />
              <div>
                <h1 className="h2 fw-bold mb-1 text-gray-900">Fantasy Teams ({filteredTeams.length})</h1>
                <p className="mb-0 text-gray-600 lead">
                  {showUserTeams ? 'Your teams' : 'Public teams'} - Search, filter & create
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-lg-end">
            <div className="btn-group me-3 mb-3 mb-lg-0">
              <button 
                className={`btn btn-lg px-4 rounded-pill fw-semibold ${
                  showUserTeams ? 'btn-primary shadow-sm' : 'btn-outline-primary'
                }`}
                onClick={() => setShowUserTeams(true)}
              >
                My Teams ({userTeams.length})
              </button>
              <button 
                className={`btn btn-lg px-4 rounded-pill fw-semibold ${
                  !showUserTeams ? 'btn-primary shadow-sm' : 'btn-outline-primary'
                }`}
                onClick={() => setShowUserTeams(false)}
              >
                Public Teams ({allTeams.length})
              </button>
            </div>
            <button className="btn btn-success btn-lg px-5 fw-bold shadow-sm rounded-pill" onClick={handleCreateTeam}>
              <FaPlus className="me-2" />
              Create Team
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="card shadow-sm border-0 rounded-3 mb-5 overflow-hidden">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-lg-5">
                <label className="form-label fw-semibold text-gray-700 mb-2 d-block">Search Teams</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 rounded-start">
                    <FaSearch className="text-muted" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 shadow-none ps-3" 
                    placeholder="Search Kohli Smashers, Bumrah..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <div className="col-lg-4">
                <label className="form-label fw-semibold text-gray-700 mb-2 d-block">Filter</label>
                <select 
                  className="form-select shadow-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Teams ({filteredTeams.length})</option>
                  <option value="public">Public Only</option>
                  <option value="private">Private Only</option>
                </select>
              </div>
              <div className="col-lg-3">
                <button className="btn btn-primary w-100 h-100 fw-semibold rounded-pill shadow-sm" onClick={loadTeams}>
                  <FaFilter className="me-2" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="row g-4">
          {filteredTeams.length === 0 ? (
            <div className="col-12 text-center py-10 fade-in-up">
              <div className="display-3 text-muted mb-4 opacity-25">
                <FaUsers />
              </div>
              <h2 className="mb-4 text-gray-600">No teams match your filters</h2>
              <p className="lead text-muted mb-5">
                Try {'"Kohli"'} or {'"active"'} or create your first team
              </p>
              <div className="d-grid gap-2 d-md-block">
                <button className="btn btn-primary btn-lg px-6 rounded-pill shadow-lg me-md-3 mb-3 mb-md-0" onClick={handleCreateTeam}>
                  <FaPlus className="me-2" />
                  Create Team
                </button>
                <button className="btn btn-outline-secondary btn-lg px-6 rounded-pill" onClick={() => {setSearch(''); setFilter('all');}}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div key={team._id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift overflow-hidden bg-white">
                  <div className="card-header bg-gradient-primary text-white py-4 px-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1 fw-bold">{team.name}</h5>
                        <small className="opacity-90">{team.contestName || team.match}</small>
                      </div>
                      <span className={`badge px-3 py-2 fw-semibold rounded-pill ${getStatusBadge(team.status || 'active')}`}>
                        {team.status === 'active' ? 'Live' : team.status?.charAt(0).toUpperCase() + team.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    {/* Stats */}
                    <div className="mb-4">
                      <div className="row g-3 text-center">
                        <div className="col-4">
                          <div className="text-muted small mb-1">Points</div>
                          <div className="h4 fw-bold text-primary">{team.points || 0}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small mb-1">Players</div>
                          <div className="h4 text-success">{team.players || 0}/11</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small mb-1">Rank</div>
                          <div className="h4 fw-bold">{team.rank || '-'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Captain VC */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-3">
                      <div className="small text-muted text-center mb-3 fw-semibold">Captain & Vice-Captain</div>
                      <div className="row g-2">
                        <div className="col">
                          <div className="text-center">
                            <div className="fw-bold text-gray-900 small mb-1">{team.captainName || 'Set Captain'}</div>
                            <span className="badge bg-primary px-2 py-1">C</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="text-center">
                            <div className="fw-bold text-gray-900 small mb-1">{team.viceCaptainName || 'Set VC'}</div>
                            <span className="badge bg-orange px-2 py-1">VC</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-grid gap-2">
                      <Link to={`/teams/${team._id}`} className="btn btn-primary fw-semibold rounded-pill py-2">
                        <FaEye className="me-2" />
                        View Details
                      </Link>
                      {showUserTeams && (
                        <>
                          <button className="btn btn-outline-primary fw-semibold rounded-pill py-2">
                            <FaEdit className="me-2" />
                            Edit Team
                          </button>
                          <button className="btn btn-outline-danger fw-semibold rounded-pill py-2">
                            <FaTrash className="me-2" />
                            Delete Team
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamList;
