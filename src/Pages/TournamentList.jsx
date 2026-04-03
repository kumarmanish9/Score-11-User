import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { getTournaments, joinTournament } from '../Services/tournamentService';
import { FaSearch, FaTrophy, FaUsers } from 'react-icons/fa';
import '../Components/PagesCss/Matches.css'; // reuse matches css or create new

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await getTournaments();
      setTournaments(data);
      setError('');
    } catch (err) {
      setError('Failed to load tournaments. Check backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTournaments = tournaments.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (id) => {
    if (!user) {
      alert('Login required');
      navigate('/login');
      return;
    }
    try {
      await joinTournament(id);
      alert('Joined successfully!');
      fetchTournaments(); // refresh
    } catch (err) {
      alert('Join failed');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Tournaments <FaTrophy className="ms-2" />
          </h1>
          <p className="lead text-muted">Join exciting cricket tournaments</p>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-lg-6 mx-auto">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white">
              <FaSearch />
            </span>
            <input 
              type="text" 
              className="form-control border-0 fs-6" 
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning text-center">{error}</div>
      )}

      {/* Grid */}
      <div className="row g-4">
        {filteredTournaments.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h3>No tournaments found</h3>
            <p className="text-muted">Try different search</p>
          </div>
        ) : (
          filteredTournaments.map((tournament) => (
            <div key={tournament._id || tournament.id} className="col-lg-3 col-md-6">
              <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="badge bg-success fs-6 px-3 py-2 me-2">
                      {tournament.status || 'Upcoming'}
                    </div>
                  </div>
                  <h5 className="card-title fw-bold mb-3">{tournament.name}</h5>
                  <p className="card-text text-muted mb-3">{tournament.description || 'Join now!'}</p>
                  <div className="row text-center mb-3">
                    <div className="col-6 border-end">
                      <FaUsers className="text-primary mb-1" />
                      <div className="fw-bold">{tournament.teamsCount || 0}</div>
                      <small>Teams</small>
                    </div>
                    <div className="col-6">
                      <FaTrophy className="text-warning mb-1" />
                      <div className="fw-bold text-warning">₹{tournament.prize || 0}</div>
                      <small>Prize</small>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary w-100 rounded-pill fw-bold"
                    onClick={() => handleJoin(tournament._id || tournament.id)}
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TournamentList;

