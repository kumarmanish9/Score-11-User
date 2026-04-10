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

  // No local mock data: use API via playerService (searchPlayers/getPlayers)

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
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
      const finalData = Array.isArray(data) ? data : [];

      const normalizeRole = (raw) => {
        if (!raw) return undefined;
        const r = String(raw).toLowerCase();
        if (r.includes('bat') || r.includes('batter')) return 'Batsman';
        if (r.includes('wk') || r.includes('wicket')) return 'Wicketkeeper';
        if (r.includes('all') || r.includes('all-round') || r.includes('allround')) return 'All-Rounder';
        if (r.includes('bowl') || r.includes('bowler') || r.includes('spinner') || r.includes('pace')) return 'Bowler';
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      };

      const normalizePlayer = (p) => {
        if (!p || typeof p !== 'object') return p;
        const name = p.name || p.fullName || p.playerName || p.shortName || p.displayName || p.short_name || (p.player && (p.player.name || p.player.fullName)) || 'Unknown Player';
        const team = p.team || p.teamName || p.team_name || (p.teamObj && (p.teamObj.name || p.teamObj.shortName)) || '';
        const avatar = p.avatar || p.picture || p.image || p.profilePic || (p.player && (p.player.avatar || p.player.image)) || null;
        const roleRaw = p.role || p.playerRole || p.position || p.type || p.primaryRole || p.roleName || (p.player && p.player.role);
        const role = normalizeRole(roleRaw);
        return { ...p, name, team, avatar, role };
      };

      const normalized = finalData.map(normalizePlayer);
      setPlayers(normalized);
      setAllPlayers(normalized);
    } catch (err) {
      console.error('Player search API error:', err);
      setError('Failed to load players. Please try again.');
      setPlayers([]);
      setAllPlayers([]);
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

  // NOTE: don't block the whole page while loading so users can continue typing.

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
              Retry
            </button>
          </div>
        )}

        {/* Players Grid */}
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-10">
              <div className="spinner-border text-primary pulse-animation" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Loading players...</span>
              </div>
            </div>
          ) : filteredPlayers.length === 0 ? (
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
                    src={player.avatar || null}
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
