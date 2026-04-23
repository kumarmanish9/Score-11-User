import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getLiveStreams } from '../Services/liveStreamService';
import AgoraPlayer from '../Components/AgoraPlayer';
import { FaVideo, FaPlay, FaPlus, FaUsers, FaEye, FaThumbsUp, FaShare, FaArrowLeft, FaFire, FaCalendar, FaUser } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .live-streams-container {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
    min-height: 100vh;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    padding: 80px 0 60px;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    color: white;
    margin-bottom: 16px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.9);
    max-width: 500px;
    margin: 0 auto;
  }

  /* Topbar */
  .topbar {
    background: rgba(15, 15, 30, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 16px 32px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .back-btn {
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 10px 20px;
    color: white;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    font-weight: 600;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(-2px);
  }

  /* Go Live Button */
  .go-live-btn {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    border: none;
    padding: 16px 32px;
    border-radius: 50px;
    font-weight: 800;
    font-size: 18px;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  .go-live-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(220, 38, 38, 0.5);
  }

  /* Stream Card */
  .stream-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1);
    height: 100%;
  }

  .stream-card:hover {
    transform: translateY(-8px);
    border-color: rgba(220, 38, 38, 0.5);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  .stream-preview {
    position: relative;
    height: 240px;
    background: #000;
    overflow: hidden;
  }

  .live-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #dc2626;
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .viewer-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
  }

  .stream-info {
    padding: 24px;
  }

  .stream-title {
    font-size: 18px;
    font-weight: 800;
    color: white;
    margin-bottom: 8px;
  }

  .streamer-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .streamer-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
  }

  .streamer-name {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
  }

  .stream-description {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .stream-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
  }

  .stream-stats span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .watch-btn {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    color: white;
    width: 100%;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .watch-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 40px;
    background: rgba(255,255,255,0.05);
    border-radius: 30px;
    backdrop-filter: blur(10px);
  }

  .empty-icon {
    font-size: 80px;
    color: rgba(255,255,255,0.2);
    margin-bottom: 24px;
  }

  .empty-state h3 {
    color: white;
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .empty-state p {
    color: rgba(255,255,255,0.6);
    margin-bottom: 24px;
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
  }

  .custom-spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(220, 38, 38, 0.2);
    border-top-color: #dc2626;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  /* Stats Cards */
  .stat-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #dc2626;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    .hero-subtitle {
      font-size: 1rem;
      padding: 0 20px;
    }
    .topbar {
      padding: 12px 16px;
    }
    .back-btn span {
      display: none;
    }
    .go-live-btn {
      padding: 12px 24px;
      font-size: 14px;
    }
    .stream-preview {
      height: 200px;
    }
    .stat-value {
      font-size: 24px;
    }
  }
`;

const LiveStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStreams();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStreams, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const data = await getLiveStreams();
      setStreams(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('No live streams available at the moment');
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = () => {
    if (!user) {
      alert('Please login to go live');
      navigate('/login');
      return;
    }
    navigate('/go-live');
  };

  const totalViewers = streams.reduce((sum, stream) => sum + (stream.viewerCount || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="live-streams-container">
        {/* Topbar */}
        <div className="topbar">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/dashboard" className="back-btn">
                <FaArrowLeft size={18} />
                <span>Back to Dashboard</span>
              </Link>
              <div className="d-flex align-items-center gap-3">
                <FaFire style={{ color: '#dc2626', fontSize: 24 }} />
                <span style={{ color: 'white', fontWeight: 700 }}>Live Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="container text-center">
            <h1 className="hero-title">
              <FaVideo className="me-3" style={{ fontSize: 40 }} />
              Live Streams
            </h1>
            <p className="hero-subtitle">
              Watch live cricket matches, expert analysis, and exclusive content
            </p>
          </div>
        </div>

        <div className="container py-5">
          {/* Stats Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-3 col-6">
              <div className="stat-card fade-in-up">
                <div className="stat-value">{streams.length}</div>
                <div className="stat-label">Active Streams</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="stat-value">{totalViewers.toLocaleString()}</div>
                <div className="stat-label">Total Viewers</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="stat-value">{user ? '🎥' : '👤'}</div>
                <div className="stat-label">{user ? 'Ready to Stream' : 'Login to Stream'}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-card fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="stat-value">24/7</div>
                <div className="stat-label">Live Coverage</div>
              </div>
            </div>
          </div>

          {/* Go Live Button */}
          {user && (
            <div className="row mb-5">
              <div className="col-12 text-center">
                <button className="go-live-btn" onClick={handleGoLive}>
                  <FaPlus size={20} />
                  Start Live Streaming
                  <FaVideo size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-info text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '16px' }}>
              {error}
            </div>
          )}

          {/* Streams Grid */}
          {streams.length > 0 ? (
            <div className="row g-4">
              {streams.map((stream, index) => (
                <div key={stream._id} className="col-lg-4 col-md-6">
                  <div className="stream-card fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="stream-preview">
                      <div className="live-badge">
                        <span>●</span> LIVE
                      </div>
                      <div className="viewer-badge">
                        <FaEye size={12} />
                        {stream.viewerCount || 0} watching
                      </div>
                      <AgoraPlayer 
                        streamId={stream._id} 
                        role="subscriber"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className="stream-info">
                      <h6 className="stream-title">{stream.title || 'Live Cricket Stream'}</h6>
                      <div className="streamer-info">
                        <div className="streamer-avatar">
                          {stream.streamerName?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <span className="streamer-name">
                          {stream.streamerName || 'Cricket Fan'} • {stream.category || 'Cricket'}
                        </span>
                      </div>
                      <p className="stream-description">
                        {stream.description || `Live ${stream.category || 'cricket'} action streaming now! Join the excitement.`}
                      </p>
                      <div className="stream-stats">
                        <span><FaThumbsUp size={12} /> {stream.likes || 0}</span>
                        <span><FaShare size={12} /> {stream.shares || 0}</span>
                        <span><FaUsers size={12} /> {stream.viewerCount || 0}</span>
                      </div>
                      <button 
                        className="watch-btn"
                        onClick={() => navigate(`/live/${stream._id}`)}
                      >
                        <FaPlay className="me-2" />
                        Watch Live Stream
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state fade-in-up">
              <div className="empty-icon">
                <FaVideo />
              </div>
              <h3>No Live Streams Available</h3>
              <p>Be the first to go live and share your cricket moments!</p>
              {user ? (
                <button className="go-live-btn" onClick={handleGoLive}>
                  <FaPlus className="me-2" />
                  Start Your First Stream
                </button>
              ) : (
                <Link to="/login" className="go-live-btn" style={{ textDecoration: 'none' }}>
                  Login to Start Streaming
                </Link>
              )}
            </div>
          )}

          {/* Featured Section */}
          {streams.length > 0 && (
            <div className="mt-5 pt-4 text-center">
              <p className="text-white-50 small">
                🏏 Watch, interact, and enjoy live cricket action with fellow fans
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveStreams;