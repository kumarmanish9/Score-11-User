import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import LiveMatches from "../Components/DashboardSection/LiveMatches";
import { getLiveMatches, getLiveStreams } from "../Services/matchService";
import AgoraPlayer from "../Components/AgoraPlayer";
import { FaFire, FaVideo, FaSearch, FaBell, FaFunnel, FaUserCircle, FaArrowLeft, FaPlayCircle, FaUsers, FaEye, FaThumbsUp, FaShare } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
  }

  .live-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
  }

  /* Topbar Styles */
  .topbar {
    height: 70px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
  }

  .back-btn {
    background: rgba(248, 250, 252, 0.8);
    border-radius: 12px;
    padding: 12px;
    color: #64748b;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: rgba(248, 250, 252, 1);
    transform: translateX(-2px);
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-name {
    font-weight: 800;
    font-size: 20px;
    background: linear-gradient(135deg, #ef4444, #f87171);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .search-box {
    flex: 1;
    max-width: 420px;
    display: flex;
    align-items: center;
    background: rgba(241, 245, 249, 0.8);
    border-radius: 12px;
    padding: 10px 20px;
    gap: 10px;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .search-box:focus-within {
    background: white;
    box-shadow: 0 0 0 2px #ef4444, 0 0 0 4px rgba(239, 68, 68, 0.1);
  }

  .search-icon {
    color: #94a3b8;
    font-size: 16px;
  }

  .search-input {
    background: none;
    border: none;
    font-size: 15px;
    color: #475569;
    flex: 1;
    font-family: inherit;
    outline: none;
  }

  .search-input::placeholder {
    color: #94a3b8;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .go-live-btn {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: #fff;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 700;
    font-size: 14px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .go-live-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(239, 68, 68, 0.5);
  }

  .notif-btn {
    background: rgba(241, 245, 249, 0.8);
    border-radius: 12px;
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .notif-btn:hover {
    background: rgba(241, 245, 249, 1);
    transform: scale(1.05);
  }

  .notif-dot {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    border: 2px solid white;
  }

  .avatar-box {
    cursor: pointer;
  }

  .avatar {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .avatar:hover {
    transform: scale(1.05);
  }

  /* Main Content */
  .main-full {
    padding: 40px 48px;
    max-width: 1600px;
    margin: 0 auto;
  }

  /* Tabs */
  .tab-header {
    display: flex;
    background: #fff;
    border-radius: 16px;
    padding: 4px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .tab-btn {
    flex: 1;
    padding: 16px 24px;
    border: none;
    background: none;
    font-weight: 700;
    font-size: 16px;
    color: #64748b;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .tab-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .tab-active {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: #fff;
    box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
  }

  .content-section {
    background: #fff;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 12px 60px rgba(0, 0, 0, 0.1);
  }

  /* Streams Grid */
  .streams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
  }

  .stream-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
  }

  .stream-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
  }

  .stream-preview {
    position: relative;
    height: 240px;
    background: #000;
    overflow: hidden;
  }

  .live-indicator {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(239, 68, 68, 0.9);
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 12px;
    z-index: 2;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .viewer-count {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 12px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 6px;
    backdrop-filter: blur(10px);
  }

  .stream-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .stream-info {
    padding: 24px;
  }

  .stream-title {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .stream-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #64748b;
  }

  .stream-stats span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .watch-btn {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: #fff;
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4);
    transition: all 0.2s ease;
  }

  .watch-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(239, 68, 68, 0.5);
  }

  /* Empty State */
  .empty-live {
    text-align: center;
    padding: 100px 60px;
  }

  .empty-icon {
    font-size: 96px;
    color: #f1f5f9;
    margin-bottom: 32px;
  }

  .empty-live h3 {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .empty-live p {
    color: #64748b;
    margin-bottom: 24px;
  }

  /* Action Row */
  .action-row {
    display: flex;
    gap: 16px;
    margin-top: 32px;
    justify-content: center;
  }

  .action-btn {
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: #fff;
    padding: 16px 40px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
  }

  .action-btn-secondary {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    padding: 16px 40px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 15px;
    text-decoration: none;
    border: 2px solid rgba(99, 102, 241, 0.2);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .action-btn-secondary:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 700;
    border: 2px solid rgba(99, 102, 241, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-outline:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .custom-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #f0f0f0;
    border-top-color: #ef4444;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in-up {
    animation: fadeInUp 0.5s ease-out;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .topbar {
      padding: 0 16px;
    }
    .brand-name {
      display: none;
    }
    .search-box {
      max-width: 200px;
    }
    .go-live-btn span {
      display: none;
    }
    .main-full {
      padding: 20px 16px;
    }
    .content-section {
      padding: 20px;
    }
    .streams-grid {
      grid-template-columns: 1fr;
    }
    .action-row {
      flex-direction: column;
    }
    .action-btn, .action-btn-secondary {
      text-align: center;
      justify-content: center;
    }
    .tab-btn {
      padding: 12px 16px;
      font-size: 14px;
    }
  }
`;

function Live() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const pollInterval = useRef(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchLiveData();
    
    if (activeTab === 'streams') {
      pollInterval.current = setInterval(fetchLiveData, 10000);
    }
    
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [activeTab, search]);

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const [matchesData, streamsData] = await Promise.all([
        getLiveMatches().catch(() => []),
        getLiveStreams().catch(() => [])
      ]);
      
      const filteredMatches = matchesData.filter(m => 
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.status === 'live' ||
        m.team1?.toLowerCase().includes(search.toLowerCase()) ||
        m.team2?.toLowerCase().includes(search.toLowerCase())
      );
      
      const filteredStreams = streamsData.filter(s => 
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.category?.toLowerCase().includes(search.toLowerCase())
      );
      
      setLiveMatches(filteredMatches);
      setLiveStreams(filteredStreams);
    } catch (error) {
      console.error("Live data error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="live-root">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <Link to="/dashboard" className="back-btn">
              <FaArrowLeft size={18} />
            </Link>
            <div className="brand-logo">
              <FaFire style={{ color: "#ef4444", fontSize: 22 }} />
              <span className="brand-name">Live Now ({liveMatches.length + liveStreams.length})</span>
            </div>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                className="search-input" 
                placeholder="Search live matches/streams..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="topbar-right">
            <button className="go-live-btn" onClick={() => navigate('/go-live')}>
              <FaPlayCircle size={18} />
              <span>Go Live</span>
            </button>
            <div className="notif-btn">
              <FaBell style={{ fontSize: 16, color: "#64748b" }} />
              <span className="notif-dot"></span>
            </div>
            <div className="avatar-box">
              <div className="avatar">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <main className="main-full">
          {/* Tabs */}
          <div className="tab-header">
            <button 
              className={`tab-btn ${activeTab === 'matches' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              Live Matches ({liveMatches.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'streams' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('streams')}
            >
              Live Streams ({liveStreams.length})
            </button>
          </div>

          {/* Content */}
          <div className="content-section fade-in-up">
            {activeTab === 'matches' ? (
              liveMatches.length > 0 ? (
                <>
                  <LiveMatches matches={liveMatches} />
                  <div className="action-row">
                    <Link to="/leaderboard" className="action-btn">
                      🏆 Live Leaderboard
                    </Link>
                    <Link to="/create-team" className="action-btn-secondary">
                      ✨ Create Live Team
                    </Link>
                  </div>
                </>
              ) : (
                <div className="empty-live">
                  <FaFire className="empty-icon" />
                  <h3>No Live Matches</h3>
                  <p>Check upcoming matches or watch live streams</p>
                  <Link to="/upcoming" className="btn-outline">
                    View Upcoming Matches →
                  </Link>
                </div>
              )
            ) : (
              liveStreams.length > 0 ? (
                <div className="streams-grid">
                  {liveStreams.map((stream, index) => (
                    <div key={stream._id || index} className="stream-card">
                      <div className="stream-preview">
                        <div className="live-indicator">
                          <span>●</span> LIVE
                        </div>
                        <div className="viewer-count">
                          <FaEye size={12} />
                          {stream.viewerCount || 0} watching
                        </div>
                        <AgoraPlayer 
                          streamId={stream._id} 
                          role="subscriber"
                          className="stream-iframe"
                        />
                      </div>
                      <div className="stream-info">
                        <h6 className="stream-title">{stream.title}</h6>
                        <div className="stream-stats">
                          <span><FaUsers size={12} /> {stream.viewerCount || 0}</span>
                          <span><FaThumbsUp size={12} /> {stream.likes || 0}</span>
                          <span><FaShare size={12} /> {stream.shares || 0}</span>
                          <span>{stream.category || 'Sports'}</span>
                        </div>
                        <button 
                          className="watch-btn" 
                          onClick={() => navigate(`/live/${stream._id}`)}
                        >
                          Watch Live Stream →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-live">
                  <FaVideo className="empty-icon" />
                  <h3>No Live Streams</h3>
                  <p>Be the first to go live!</p>
                  <button className="btn-outline" onClick={() => navigate('/go-live')}>
                    🎥 Start Streaming
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Live;