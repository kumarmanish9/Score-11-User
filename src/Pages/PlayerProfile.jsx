import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerById, getPlayerMatches } from '../Services/playerService';
import { getSafeAvatarUrl, handleImageError } from '../utils/getSafeAvatarUrl.js';
import defaultAvatar from "../assets/Styles/Logo.png";
import PlayerMatches from '../Components/PlayerMatches.jsx';
import { FaBaseballBall, FaUser, FaTrophy, FaCalendarAlt, FaChartLine, FaStar, FaMedal, FaAward, FaArrowLeft, FaShare, FaHeart, FaEye } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .player-profile-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Hero Section */
  .player-hero-section {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 30px;
    padding: 40px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .player-hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .player-avatar-wrapper {
    position: relative;
    display: inline-block;
  }

  .player-avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255,255,255,0.2);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  }

  .player-avatar:hover {
    transform: scale(1.05);
    border-color: #f59e0b;
  }

  .player-role-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: white;
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .player-name {
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
  }

  .player-team-badge {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .player-bio {
    font-size: 16px;
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-create-team {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: white;
    padding: 12px 28px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-create-team:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    color: white;
  }

  .btn-other-players {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 12px 28px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-other-players:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
    color: white;
  }

  /* Stats Card */
  .stats-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    margin-bottom: 40px;
  }

  .stats-header {
    background: white;
    border-bottom: 2px solid #f0f0f0;
    padding: 0;
  }

  .stats-tabs {
    display: flex;
    gap: 8px;
    padding: 20px 20px 0 20px;
    flex-wrap: wrap;
  }

  .stats-tab {
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f8fafc;
    color: #64748b;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stats-tab.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .stats-tab:hover:not(.active) {
    background: #e2e8f0;
    transform: translateY(-2px);
  }

  .stats-body {
    padding: 30px;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .stat-item {
    background: linear-gradient(135deg, #f8fafc, #ffffff);
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
  }

  .stat-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .stat-label {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
  }

  .stat-value.primary {
    color: #3b82f6;
  }

  .stat-value.success {
    color: #10b981;
  }

  .stat-value.warning {
    color: #f59e0b;
  }

  /* Section Styles */
  .section-title {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 3px solid #3b82f6;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  /* Match Card */
  .match-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .match-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  }

  .match-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 16px;
    color: white;
  }

  .match-opponent {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .match-date {
    font-size: 11px;
    opacity: 0.8;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .match-body {
    padding: 20px;
  }

  .match-runs {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .progress-bar-custom {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  /* Achievement Card */
  .achievement-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .achievement-card:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
  }

  .achievement-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .achievement-text {
    font-size: 14px;
    font-weight: 700;
    color: white;
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
    .player-profile-page {
      padding: 20px 0;
    }
    .player-hero-section {
      padding: 24px;
    }
    .player-name {
      font-size: 24px;
      margin-top: 20px;
    }
    .player-avatar {
      width: 150px;
      height: 150px;
    }
    .stat-value {
      font-size: 24px;
    }
    .stats-tabs {
      justify-content: center;
    }
    .stats-tab {
      padding: 8px 16px;
      font-size: 12px;
    }
  }
`;

function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsTab, setStatsTab] = useState('batting');
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getPlayerById(id);
      const data = res?.data || res || null;

      if (!data) {
        throw new Error('No player data');
      }

      const normalized = {
        _id: data._id || data.id || id,
        name: data.name || data.playerName || data.fullName || 'Unknown Player',
        avatar: getSafeAvatarUrl(data.avatar?.url || data.avatar || data.image),
        role: data.role || data.position || 'Player',
        team: data.team?.name || data.team || data.teamName || 'Unknown Team',
        bio: data.bio || data.description || '',
        recentMatches: Array.isArray(data.recentMatches) ? data.recentMatches : (Array.isArray(data.matchesList) ? data.matchesList : []),
        achievements: Array.isArray(data.achievements) ? data.achievements : (data.awards ? [data.awards].flat() : []),
        stats: data.stats || data.statistics || null,
        totalPoints: data.totalPoints || 0,
        ranking: data.ranking || 0,
      };

      setPlayer(normalized);
    } catch (err) {
      console.error('Player fetch error:', err);
      setError('Failed to load player profile');
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  const defaultStats = {
    batting: { matches: 0, runs: 0, avg: 0, sr: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, highest: 0 },
    bowling: { matches: 0, wickets: 0, avg: 0, econ: 0, best: '0/0', fiveWickets: 0, maidens: 0 },
    fielding: { matches: 0, catches: 0, runouts: 0, stumpings: 0 }
  };

  const statsData = (player && player.stats) ? player.stats : defaultStats;
  const statsForTab = statsData[statsTab] || defaultStats[statsTab];

  const getStatValue = (key) => {
    if (key === 'runs') return statsForTab.runs || 0;
    if (key === 'wickets') return statsForTab.wickets || 0;
    if (key === 'avg') return statsForTab.avg || 0;
    if (key === 'sr') return statsForTab.sr || 0;
    if (key === 'econ') return statsForTab.econ || 0;
    if (key === 'highest') return statsForTab.highest || 0;
    if (key === 'fours') return statsForTab.fours || 0;
    if (key === 'sixes') return statsForTab.sixes || 0;
    if (key === 'fifties') return statsForTab.fifties || 0;
    if (key === 'hundreds') return statsForTab.hundreds || 0;
    if (key === 'fiveWickets') return statsForTab.fiveWickets || 0;
    if (key === 'catches') return statsForTab.catches || 0;
    if (key === 'runouts') return statsForTab.runouts || 0;
    return 0;
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading player profile...</p>
        </div>
      </>
    );
  }

  if (error || !player) {
    return (
      <>
        <style>{styles}</style>
        <div className="player-profile-page d-flex align-items-center justify-content-center">
          <div className="text-center p-5">
            <div className="mb-4">
              <FaUser size={60} style={{ color: '#cbd5e1' }} />
            </div>
            <h2 className="mb-3" style={{ color: '#1e293b' }}>{error || 'Player Not Found'}</h2>
            <p className="text-muted mb-4">The player you're looking for doesn't exist or has been removed.</p>
            <Link to="/players" className="btn btn-primary">Browse All Players</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="player-profile-page">
        <div className="container">
          {/* Hero Section */}
          <div className="player-hero-section">
            <div className="row align-items-center">
              <div className="col-lg-4 text-center text-lg-start">
                <div className="player-avatar-wrapper">
                  <img 
                    src={getSafeAvatarUrl(player.avatar)} 
                    alt={player.name}
                    className="player-avatar"
                    onError={(e) => handleImageError(e, defaultAvatar)}
                  />
                  <div className="player-role-badge">
                    {player.role}
                  </div>
                </div>
              </div>
              <div className="col-lg-8 mt-4 mt-lg-0">
                <h1 className="player-name">{player.name}</h1>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <span className="player-team-badge">
                    <FaBaseballBall size={14} /> {player.team}
                  </span>
                  <span className="player-team-badge">
                    <FaStar size={14} /> Rank #{player.ranking || 'N/A'}
                  </span>
                  <span className="player-team-badge">
                    <FaChartLine size={14} /> {player.totalPoints} Points
                  </span>
                </div>
                <p className="player-bio">
                  {player.bio || `${player.name} is a professional ${player.role} known for exceptional skills and match-winning performances.`}
                </p>
                <div className="action-buttons">
                  <Link to="/contests" className="btn-create-team">
                    <FaBaseballBall /> Create Team
                  </Link>
                  <Link to="/players" className="btn-other-players">
                    Browse Players
                  </Link>
                  <button 
                    className="btn-other-players" 
                    onClick={() => setLiked(!liked)}
                    style={{ background: liked ? '#dc2626' : 'rgba(255,255,255,0.1)' }}
                  >
                    <FaHeart /> {liked ? 'Liked' : 'Like'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-tabs">
                <button 
                  className={`stats-tab ${statsTab === 'batting' ? 'active' : ''}`}
                  onClick={() => setStatsTab('batting')}
                >
                  <FaBaseballBall /> Batting
                </button>
                <button 
                  className={`stats-tab ${statsTab === 'bowling' ? 'active' : ''}`}
                  onClick={() => setStatsTab('bowling')}
                >
                  <FaBaseballBall /> Bowling
                </button>
                <button 
                  className={`stats-tab ${statsTab === 'fielding' ? 'active' : ''}`}
                  onClick={() => setStatsTab('fielding')}
                >
                  <FaUser /> Fielding
                </button>
              </div>
            </div>
            <div className="stats-body">
              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-label">Matches</div>
                  <div className="stat-value primary">{getStatValue('matches')}</div>
                </div>
                
                {statsTab === 'batting' && (
                  <>
                    <div className="stat-item">
                      <div className="stat-label">Runs</div>
                      <div className="stat-value success">{getStatValue('runs')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Average</div>
                      <div className="stat-value">{getStatValue('avg')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Strike Rate</div>
                      <div className="stat-value warning">{getStatValue('sr')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Highest</div>
                      <div className="stat-value">{getStatValue('highest')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Fours</div>
                      <div className="stat-value">{getStatValue('fours')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Sixes</div>
                      <div className="stat-value">{getStatValue('sixes')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">50s</div>
                      <div className="stat-value">{getStatValue('fifties')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">100s</div>
                      <div className="stat-value">{getStatValue('hundreds')}</div>
                    </div>
                  </>
                )}

                {statsTab === 'bowling' && (
                  <>
                    <div className="stat-item">
                      <div className="stat-label">Wickets</div>
                      <div className="stat-value success">{getStatValue('wickets')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Average</div>
                      <div className="stat-value">{getStatValue('avg')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Economy</div>
                      <div className="stat-value warning">{getStatValue('econ')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Best Bowling</div>
                      <div className="stat-value">{statsForTab.best || '0/0'}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">5-Wicket Hauls</div>
                      <div className="stat-value">{getStatValue('fiveWickets')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Maidens</div>
                      <div className="stat-value">{getStatValue('maidens')}</div>
                    </div>
                  </>
                )}

                {statsTab === 'fielding' && (
                  <>
                    <div className="stat-item">
                      <div className="stat-label">Catches</div>
                      <div className="stat-value success">{getStatValue('catches')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Run Outs</div>
                      <div className="stat-value">{getStatValue('runouts')}</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-label">Stumpings</div>
                      <div className="stat-value warning">{getStatValue('stumpings')}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <PlayerMatches playerId={player._id} />

          {/* Achievements */}
          {player.achievements && player.achievements.length > 0 && (
            <div>
              <h2 className="section-title">
                <FaTrophy /> Achievements & Awards
              </h2>
              <div className="row g-3">
                {player.achievements.map((achievement, index) => (
                  <div key={index} className="col-md-4 col-lg-3">
                    <div className="achievement-card">
                      <div className="achievement-icon">
                        {index === 0 ? <FaTrophy /> : <FaMedal />}
                      </div>
                      <div className="achievement-text">{achievement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PlayerProfile;