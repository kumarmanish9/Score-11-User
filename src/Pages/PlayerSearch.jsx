import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { searchPlayers, getPlayers } from '../Services/playerService';
import { FaSearch, FaUser, FaStar, FaUserPlus, FaFilter } from 'react-icons/fa';
import "../assets/Styles/Global.css";

const PlayerSearch = () => {
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // **MOCK PLAYERS DATA** - For demo/search
  const mockPlayers = [
    {
      _id: '1',
      name: 'Virat Kohli',
      team: 'RCB',
      role: 'Batsman',
      points: 892,
      average: 45.6,
      runs: 6234,
      matches: 245,
      avatar: 'https://images.unsplash.com/photo-1570545887596-2d78a406c217?w=300'
    },
    {
      _id: '2',
      name: 'Rohit Sharma',
      team: 'MI',
      role: 'Batsman',
      points: 765,
      average: 42.3,
      runs: 5890,
      matches: 256,
      avatar: 'https://images.unsplash.com/photo-1607345412315-79b4a2564405?w=300'
    },
    {
      _id: '3',
      name: 'Jasprit Bumrah',
      team: 'MI',
      role: 'Bowler',
      points: 945,
      average: 21.4,
      wickets: 156,
      matches: 132,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300'
    },
    {
      _id: '4',
      name: 'KL Rahul',
      team: 'LSG',
      role: 'Wicketkeeper',
      points: 678,
      average: 38.9,
      runs: 4567,
      matches: 198,
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
    },
    {
      _id: '5',
      name: 'Hardik Pandya',
      team: 'GT',
      role: 'All-Rounder',
      points: 823,
      average: 32.1,
      runs: 2345,
      wickets: 67,
      matches: 156,
      avatar: 'https://images.unsplash.com/photo-1595874078383-cff1d3c8645b?w=300'
    },
    {
      _id: '6',
      name: 'Rashid Khan',
      team: 'GT',
      role: 'Bowler',
      points: 901,
      average: 18.2,
      wickets: 123,
      matches: 89,
      avatar: 'https://images.unsplash.com/photo-1610134504813-6e5563d5fd99?w=300'
    },
    {
      _id: '7',
      name: 'Suryakumar Yadav',
      team: 'MI',
      role: 'Batsman',
      points: 712,
      average: 40.5,
      runs: 2890,
      matches: 134,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2f91cbba?w=300'
    },
    {
      _id: '8',
      name: 'Rishabh Pant',
      team: 'DC',
      role: 'Wicketkeeper',
      points: 645,
      average: 35.8,
      runs: 2678,
      matches: 112,
      avatar: 'https://images.unsplash.com/photo-1642814126034-1c4c9b450adf?w=300'
    },
    {
      _id: '9',
      name: 'Kuldeep Yadav',
      team: 'DC',
      role: 'Bowler',
      points: 789,
      average: 22.7,
      wickets: 98,
      matches: 145,
      avatar: 'https://images.unsplash.com/photo-1604092436111-69722e4ab3f5?w=300'
    },
    {
      _id: '10',
      name: 'Jos Buttler',
      team: 'RR',
      role: 'Wicketkeeper',
      points: 856,
      average: 41.2,
      runs: 3456,
      matches: 167,
      avatar: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300'
    }
  ];

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...target.value));
    };
  };

  const fetchPlayers = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (query) {
        data = await searchPlayers(query);
      } else {
        data = await getPlayers();
      }
      // Mock fallback + filter
      const finalData = data || mockPlayers.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.team.toLowerCase().includes(query.toLowerCase())
      );
      setPlayers(finalData);
      setAllPlayers(finalData);
    } catch (err) {
      console.error('API error, using full mock data');
      const filteredMock = mockPlayers.filter(p => 
        !query || p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.team.toLowerCase().includes(query.toLowerCase()) ||
        p.role.toLowerCase().includes(query.toLowerCase())
      );
      setPlayers(filteredMock);
      setAllPlayers(mockPlayers);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce((query) => fetchPlayers(query), 300), []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddToTeam = (playerId) => {
    if (!user) {
      alert('Login to add players to team');
      navigate('/login');
      return;
    }
    // TODO: Real add to team (localStorage/cart or API)
    alert(`Added ${players.find(p => p._id === playerId)?.name} to your fantasy team!`);
  };

  const filteredPlayers = players.filter(player => 
    filterRole === 'all' || player.role === filterRole
  );

  const roleOptions = ['all', 'Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'];

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-offwhite py-5">
        <div className="spinner-border text-primary pulse-animation" style={{width: '4rem', height: '4rem'}} role="status">
          <span className="visually-hidden">Loading players...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-offwhite min-vh-100">
      <div className="container">
        {/* Hero Header */}
        <div className="row mb-5 text-center">
          <div className="col-lg-8 mx-auto">
            <div className="display-4 fw-bold mb-3 text-gray-900">
              <FaSearch className="me-3 text-primary fs-1" />
              Player Search
            </div>
            <p className="lead text-gray-600 mb-0">
              Find IPL stars for your fantasy team. Search by name, team or role
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="row g-3 mb-5">
          <div className="col-lg-5">
            <div className="input-group shadow-lg rounded-pill bg-white overflow-hidden">
              <span className="input-group-text bg-white border-end-0 px-4">
                <FaSearch className="text-primary fs-5" />
              </span>
              <input 
                type="text" 
                className="form-control border-0 shadow-none px-4 py-3 fs-5" 
                placeholder="Search Virat Kohli, Bumrah, RCB..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button 
                  className="btn btn-outline-secondary px-4" 
                  onClick={() => {
                    setSearchQuery('');
                    fetchPlayers('');
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="col-lg-4">
            <select 
              className="form-select shadow-sm rounded-pill py-3 fs-6 fw-semibold h-100"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
              }}
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? `All Roles (${filteredPlayers.length})` : role}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-3">
            <button 
              className="btn btn-primary w-100 rounded-pill py-3 fs-6 fw-bold shadow-sm h-100"
              onClick={() => fetchPlayers('')}
            >
              <FaFilter className="me-2" />
              Reset Filters
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning border-0 rounded-3 shadow-sm mb-5 text-center">
            <FaUser className="fs-1 text-warning mb-3" />
            <div>{error}</div>
            <button className="btn btn-outline-warning mt-2" onClick={() => fetchPlayers('')}>
              Load Demo Players
            </button>
          </div>
        )}

        {/* Players Grid */}
        <div className="row g-4">
          {filteredPlayers.length === 0 ? (
            <div className="col-12 text-center py-10">
              <div className="display-1 text-muted mb-4 opacity-50">
                <FaUser />
              </div>
              <h3 className="mb-4 text-gray-600">No players found</h3>
              <p className="lead text-muted mb-5">Try "Virat", "Bumrah" or "RCB"</p>
              <button 
                className="btn btn-primary btn-lg rounded-pill px-6 shadow-lg"
                onClick={() => fetchPlayers('')}
              >
                <FaUserPlus className="me-2" />
                Load All Players
              </button>
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <div key={player._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift overflow-hidden bg-white">
                  <img 
                    src={player.avatar}
                    alt={player.name}
                    className="card-img-top"
                    style={{height: '220px', objectFit: 'cover'}}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&fit=crop';
                    }}
                  />
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0 fw-bold text-gray-900">
                        {player.name}
                      </h5>
                      <div className={`badge fs-6 px-3 py-2 fw-semibold rounded-pill bg-${player.role === 'Bowler' ? 'danger' : player.role === 'Wicketkeeper' ? 'info' : 'success'}`}>
                        {player.role}
                      </div>
                    </div>
                    <div className="mb-4">
                      <small className="text-muted d-block mb-2">Team: <strong>{player.team}</strong></small>
                      <div className="row g-2 text-center">
                        <div className="col-4 border-end">
                          <FaStar className="text-warning fs-5 mb-1" />
                          <div className="fw-bold text-primary fs-6">{player.average || 0}</div>
                          <small>Avg</small>
                        </div>
                        <div className="col-4 border-end">
                          <FaUser className="text-info fs-5 mb-1" />
                          <div className="fw-bold text-success fs-6">{player.runs || 0}</div>
                          <small>Runs</small>
                        </div>
                        <div className="col-4">
                          <FaUser className="text-success fs-5 mb-1" />
                          <div className="fw-bold fs-6">{player.matches || 0}</div>
                          <small>Matches</small>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-success w-100 rounded-pill fw-bold py-3 shadow-sm"
                      onClick={() => handleAddToTeam(player._id)}
                    >
                      <FaUserPlus className="me-2" />
                      Add to Fantasy Team
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Count */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <small className="text-muted">
              Found {filteredPlayers.length} players • Try searching "Kohli", "Bumrah", "RCB" or "Bowler"
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSearch;
