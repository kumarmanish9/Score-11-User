import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaCrown, FaStar, FaEdit, FaTrash, FaTrophy, FaChartLine, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaMedal, FaAward, FaShare, FaDownload } from 'react-icons/fa';
import { getTeamById, deleteTeam } from '../Services/teamService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .team-details-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Hero Card */
  .team-hero-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 30px;
    overflow: hidden;
    margin-bottom: 40px;
    position: relative;
  }

  .team-hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .team-logo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255,255,255,0.2);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }

  .team-logo:hover {
    transform: scale(1.05);
    border-color: #f59e0b;
  }

  .team-name {
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 8px;
  }

  .team-short-name {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
    margin-bottom: 12px;
  }

  .team-owner {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }

  /* Stats Row */
  .stats-row-custom {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card-custom {
    background: white;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .stat-card-custom:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .stat-icon-custom {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .stat-value-custom {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label-custom {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  /* Main Card */
  .main-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    height: 100%;
  }

  .card-header-custom {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 20px 24px;
    color: white;
  }

  .card-header-custom h3 {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .player-count-badge {
    background: rgba(255,255,255,0.2);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }

  /* Players Grid */
  .players-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    padding: 24px;
  }

  .player-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    border: 1px solid #e2e8f0;
  }

  .player-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    border-color: #3b82f6;
  }

  .player-role-icon {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .captain-icon {
    color: #f59e0b;
    font-size: 20px;
  }

  .vice-captain-icon {
    color: #3b82f6;
    font-size: 18px;
  }

  .player-avatar-small {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 28px;
    font-weight: 800;
    color: white;
  }

  .player-name-card {
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .player-role-card {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .player-jersey {
    font-size: 11px;
    color: #94a3b8;
  }

  /* Info Card */
  .info-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    margin-bottom: 20px;
  }

  .info-header {
    background: linear-gradient(135deg, #10b981, #059669);
    padding: 16px 20px;
    color: white;
  }

  .info-header h5 {
    font-size: 18px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info-body {
    padding: 20px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
  }

  .info-value {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  /* Action Buttons */
  .action-buttons-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn-edit {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    padding: 14px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-edit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    color: white;
  }

  .btn-delete {
    background: #fee2e2;
    color: #dc2626;
    padding: 14px;
    border-radius: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-delete:hover {
    background: #fecaca;
    transform: translateY(-2px);
  }

  .btn-back {
    background: #f1f5f9;
    color: #475569;
    padding: 14px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-back:hover {
    background: #e2e8f0;
    transform: translateX(-4px);
  }

  .btn-share {
    background: #f1f5f9;
    color: #475569;
    padding: 14px;
    border-radius: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-share:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  /* Empty State */
  .empty-players {
    text-align: center;
    padding: 60px 20px;
    color: #94a3b8;
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
    .team-details-page {
      padding: 20px 0;
    }
    .team-name {
      font-size: 24px;
    }
    .team-logo {
      width: 80px;
      height: 80px;
    }
    .players-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      padding: 16px;
    }
    .stat-value-custom {
      font-size: 20px;
    }
  }
`;

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamById(id);
      setTeam(data);
    } catch (err) {
      setError('Failed to load team details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await deleteTeam(id);
        navigate('/my-teams');
      } catch (err) {
        alert('Error deleting team. Please try again.');
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/teams/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const getPlayerRoleIcon = (player, index) => {
    if (team.captain?._id === player._id) {
      return <FaCrown className="captain-icon" title="Captain" />;
    }
    if (team.viceCaptain?._id === player._id) {
      return <FaStar className="vice-captain-icon" title="Vice-Captain" />;
    }
    return null;
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading team details...</p>
        </div>
      </>
    );
  }

  if (error || !team) {
    return (
      <>
        <style>{styles}</style>
        <div className="team-details-page d-flex align-items-center justify-content-center">
          <div className="text-center p-5">
            <div className="mb-4">
              <FaUsers size={60} style={{ color: '#cbd5e1' }} />
            </div>
            <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>Team Not Found</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>{error || 'The team you\'re looking for doesn\'t exist.'}</p>
            <Link to="/my-teams" className="btn btn-primary">Back to My Teams</Link>
          </div>
        </div>
      </>
    );
  }

  const players = team.players || [];
  const activePlayers = players.filter(p => p.status !== 'injured');
  const totalPoints = team.points || 0;
  const matchesPlayed = team.matchesPlayed || 0;
  const winRate = matchesPlayed > 0 ? ((team.wins || 0) / matchesPlayed * 100).toFixed(1) : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="team-details-page">
        <div className="container">
          {/* Hero Section */}
          <div className="team-hero-card">
            <div className="text-center p-5">
              {team.logo?.url && (
                <img 
                  src={team.logo.url} 
                  alt={team.name} 
                  className="team-logo mb-3"
                />
              )}
              <h1 className="team-name">{team.name}</h1>
              <div className="team-short-name">{team.shortName || team.name}</div>
              <div className="team-owner">
                <FaUser size={14} />
                Owned by {team.owner?.name || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row-custom">
            <div className="stat-card-custom">
              <div className="stat-icon-custom">👥</div>
              <div className="stat-value-custom">{players.length}/25</div>
              <div className="stat-label-custom">Players</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">🏆</div>
              <div className="stat-value-custom">{totalPoints}</div>
              <div className="stat-label-custom">Total Points</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">📊</div>
              <div className="stat-value-custom">{winRate}%</div>
              <div className="stat-label-custom">Win Rate</div>
            </div>
            <div className="stat-card-custom">
              <div className="stat-icon-custom">🎯</div>
              <div className="stat-value-custom">{matchesPlayed}</div>
              <div className="stat-label-custom">Matches Played</div>
            </div>
          </div>

          <div className="row g-4">
            {/* Team Lineup */}
            <div className="col-lg-8">
              <div className="main-card">
                <div className="card-header-custom">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3>
                      <FaUsers /> Team Lineup
                    </h3>
                    <span className="player-count-badge">
                      {activePlayers.length} Active Players
                    </span>
                  </div>
                </div>
                {players.length > 0 ? (
                  <div className="players-grid">
                    {players.map((player, index) => (
                      <div key={player._id} className="player-card">
                        <div className="player-role-icon">
                          {getPlayerRoleIcon(player, index)}
                        </div>
                        <div className="player-avatar-small">
                          {getInitials(player.playerName || player.name)}
                        </div>
                        <div className="player-name-card">
                          {player.playerName || player.name}
                        </div>
                        <div className="player-role-card">
                          {player.role || 'Player'}
                        </div>
                        <div className="player-jersey">
                          #{player.jerseyNumber || 'N/A'}
                        </div>
                        {player.points && (
                          <div className="mt-2 text-success fw-bold small">
                            {player.points} pts
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-players">
                    <FaUsers size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                    <p>No players added to this team yet</p>
                    <Link to={`/teams/${id}/edit`} className="btn btn-primary btn-sm">
                      Add Players
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Team Info */}
            <div className="col-lg-4">
              {/* Leadership Card */}
              <div className="info-card">
                <div className="info-header">
                  <h5>
                    <FaCrown /> Leadership
                  </h5>
                </div>
                <div className="info-body">
                  <div className="info-row">
                    <span className="info-label">Captain</span>
                    <span className="info-value">
                      {team.captain?.playerName || team.captain?.name || 'Not Set'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Vice-Captain</span>
                    <span className="info-value">
                      {team.viceCaptain?.playerName || team.viceCaptain?.name || 'Not Set'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Coach</span>
                    <span className="info-value">{team.coach || 'TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Team Details Card */}
              <div className="info-card">
                <div className="info-header" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <h5>
                    <FaShieldAlt /> Team Details
                  </h5>
                </div>
                <div className="info-body">
                  <div className="info-row">
                    <span className="info-label">Location</span>
                    <span className="info-value">{team.city}, {team.state}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Home Ground</span>
                    <span className="info-value">{team.homeGround || 'TBD'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Founded</span>
                    <span className="info-value">{team.founded || 'N/A'}</span>
                  </div>
                  {team.description && (
                    <div className="mt-3">
                      <div className="info-label mb-2">Team Strategy</div>
                      <p className="small text-muted mb-0">{team.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements Card */}
              {team.achievements && team.achievements.length > 0 && (
                <div className="info-card">
                  <div className="info-header" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <h5>
                      <FaMedal /> Achievements
                    </h5>
                  </div>
                  <div className="info-body">
                    {team.achievements.map((achievement, idx) => (
                      <div key={idx} className="info-row">
                        <span className="info-value">
                          <FaAward className="me-2" style={{ color: '#f59e0b' }} />
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons-group">
                <Link to={`/teams/${id}/edit`} className="btn-edit">
                  <FaEdit /> Edit Team
                </Link>
                <button onClick={handleDelete} className="btn-delete">
                  <FaTrash /> Delete Team
                </button>
                <button onClick={handleShare} className="btn-share">
                  <FaShare /> {shareSuccess ? 'Copied!' : 'Share Team'}
                </button>
                <Link to="/my-teams" className="btn-back">
                  <FaArrowLeft /> Back to My Teams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetails;