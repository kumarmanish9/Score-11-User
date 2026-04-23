import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { getTournaments, joinTournament } from '../Services/tournamentService';
import { FaSearch, FaTrophy, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaMedal, FaRupeeSign, FaLock, FaArrowRight } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .tournament-page {
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
    font-size: 56px;
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
    margin-bottom: 0;
  }

  /* Search Container */
  .search-container {
    max-width: 500px;
    margin: 0 auto 40px;
  }

  .search-wrapper {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 18px;
  }

  .search-input {
    width: 100%;
    padding: 16px 20px 16px 50px;
    font-size: 15px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 2px solid #e2e8f0;
    border-radius: 20px;
    background: white;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  /* Tournaments Grid */
  .tournaments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
  }

  /* Tournament Card */
  .tournament-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    position: relative;
  }

  .tournament-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  /* Card Header with Gradient */
  .card-gradient-header {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }

  .card-gradient-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .status-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .status-upcoming {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
  }

  .status-ongoing {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }

  .status-completed {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
  }

  .tournament-name {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin: 0;
    line-height: 1.3;
  }

  /* Card Body */
  .card-body-custom {
    padding: 24px;
  }

  .tournament-description {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  /* Info Items */
  .info-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
  }

  .info-icon {
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    font-size: 14px;
  }

  .info-text {
    flex: 1;
  }

  .info-label {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  /* Stats Row */
  .stats-row-tournament {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px 0;
    border-top: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
  }

  .stat-item-tournament {
    text-align: center;
  }

  .stat-icon-tournament {
    font-size: 20px;
    margin-bottom: 6px;
  }

  .stat-value-tournament {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
  }

  .stat-label-tournament {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }

  /* Join Button */
  .btn-join {
    width: 100%;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 14px;
    border: none;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .btn-join:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }

  .btn-join:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Error Alert */
  .error-alert {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 30px;
    text-align: center;
    color: #dc2626;
    font-weight: 500;
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
    margin-bottom: 0;
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
    .tournament-page {
      padding: 20px 0;
    }
    .hero-title {
      font-size: 28px;
    }
    .tournaments-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .search-container {
      margin-bottom: 30px;
    }
  }
`;

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningId, setJoiningId] = useState(null);
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
      setError('Failed to load tournaments. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'upcoming') return 'status-upcoming';
    if (statusLower === 'ongoing') return 'status-ongoing';
    if (statusLower === 'completed') return 'status-completed';
    return 'status-upcoming';
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'upcoming') return 'Upcoming';
    if (statusLower === 'ongoing') return 'Ongoing';
    if (statusLower === 'completed') return 'Completed';
    return status || 'Upcoming';
  };

  const filteredTournaments = tournaments.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = async (id) => {
    if (!user) {
      alert('Please login to join tournaments');
      navigate('/login');
      return;
    }
    
    setJoiningId(id);
    try {
      await joinTournament(id);
      alert('Successfully joined the tournament!');
      fetchTournaments(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join tournament');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading tournaments...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="tournament-page">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-icon">
              <FaTrophy />
            </div>
            <h1 className="hero-title">Tournaments</h1>
            <p className="hero-subtitle">Join exciting cricket tournaments and win big prizes</p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search tournaments by name or location..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              ⚠️ {error}
            </div>
          )}

          {/* Tournaments Grid */}
          {filteredTournaments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaTrophy />
              </div>
              <h3 className="empty-title">
                {searchQuery ? "No tournaments found" : "No tournaments available"}
              </h3>
              <p className="empty-text">
                {searchQuery 
                  ? `No tournaments match "${searchQuery}". Try a different search term.`
                  : "Check back later for new tournaments!"}
              </p>
            </div>
          ) : (
            <div className="tournaments-grid">
              {filteredTournaments.map((tournament) => (
                <div key={tournament._id || tournament.id} className="tournament-card">
                  <div className="card-gradient-header">
                    <div className={`status-badge ${getStatusClass(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </div>
                    <h3 className="tournament-name">{tournament.name}</h3>
                  </div>
                  
                  <div className="card-body-custom">
                    <p className="tournament-description">
                      {tournament.description || 'Join this exciting tournament and showcase your skills!'}
                    </p>

                    <div className="info-items">
                      {tournament.location && (
                        <div className="info-item">
                          <div className="info-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <div className="info-text">
                            <div className="info-label">Location</div>
                            <div className="info-value">{tournament.location}</div>
                          </div>
                        </div>
                      )}
                      
                      {tournament.startDate && (
                        <div className="info-item">
                          <div className="info-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="info-text">
                            <div className="info-label">Start Date</div>
                            <div className="info-value">
                              {new Date(tournament.startDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="stats-row-tournament">
                      <div className="stat-item-tournament">
                        <div className="stat-icon-tournament">
                          <FaUsers style={{ color: '#3b82f6' }} />
                        </div>
                        <div className="stat-value-tournament">{tournament.teamsCount || 0}</div>
                        <div className="stat-label-tournament">Teams</div>
                      </div>
                      <div className="stat-item-tournament">
                        <div className="stat-icon-tournament">
                          <FaRupeeSign style={{ color: '#f59e0b' }} />
                        </div>
                        <div className="stat-value-tournament">
                          {tournament.prize?.toLocaleString() || 0}
                        </div>
                        <div className="stat-label-tournament">Prize Pool</div>
                      </div>
                    </div>

                    <button 
                      className="btn-join"
                      onClick={() => handleJoin(tournament._id || tournament.id)}
                      disabled={joiningId === (tournament._id || tournament.id)}
                    >
                      {joiningId === (tournament._id || tournament.id) ? (
                        <>
                          <div className="custom-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Tournament <FaArrowRight />
                        </>
                      )}
                    </button>
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

export default TournamentList;