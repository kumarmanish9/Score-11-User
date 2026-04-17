import React, { useState, useEffect } from "react";
import { Link, useContext } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import LiveMatches from "../Components/DashboardSection/LiveMatches";
import { getLiveMatches, getLiveStreams } from "../Services/matchService";
import { FaFire, FaVideo, FaSearch, FaBell, FaFunnel, FaUserCircle, FaArrowLeft, FaPlayCircle } from "react-icons/fa";

function Live() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches'); // matches or streams
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchLiveData();
  }, [activeTab]);

  const fetchLiveData = async () => {
    try {
      setLoading(true);
      const [matchesData, streamsData] = await Promise.all([
        getLiveMatches().catch(() => []),
        getLiveStreams().catch(() => [])
      ]);
      setLiveMatches(matchesData.filter(m => 
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.status === 'live'
      ));
      setLiveStreams(streamsData.filter(s => 
        s.title?.toLowerCase().includes(search.toLowerCase())
      ));
    } catch (error) {
      console.error("Live data error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-danger" style={{width: '3rem', height: '3rem'}} /></div>;
  }

  return (
    <div style={styles.root}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <Link to="/dashboard" style={styles.backBtn}>
            <FaArrowLeft size={18} />
          </Link>
          <div style={styles.brandLogo}>
            <FaFire style={{ color: "#ef4444", fontSize: 22 }} />
            <span style={styles.brandName}>Live Now ({liveMatches.length + liveStreams.length})</span>
          </div>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input 
              style={styles.searchInput} 
              placeholder="Search live matches/streams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={styles.topbarRight}>
          <button style={styles.goLiveBtn} onClick={() => window.location.href = '/go-live'}>
            <FaPlayCircle size={18} />
            Go Live
          </button>
          <div style={styles.notifBtn}>
            <FaBell style={{ fontSize: 16, color: "#64748b" }} />
            <span style={styles.notifDot}></span>
          </div>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {(user?.name || "L")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <main style={styles.mainFull}>
        {/* Tabs */}
        <div style={styles.tabHeader}>
          <button 
            style={{ ...styles.tabBtn, ...(activeTab === 'matches' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('matches')}
          >
            Live Matches ({liveMatches.length})
          </button>
          <button 
            style={{ ...styles.tabBtn, ...(activeTab === 'streams' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('streams')}
          >
            Live Streams ({liveStreams.length})
          </button>
        </div>

        {/* Content */}
        <div style={styles.contentSection}>
          {activeTab === 'matches' ? (
            liveMatches.length > 0 ? (
              <>
                <LiveMatches matches={liveMatches} />
                <div style={styles.actionRow}>
                  <Link to="/leaderboard" style={styles.actionBtn}>Live Leaderboard</Link>
                  <Link to="/create-team" style={styles.actionBtnSecondary}>Create Live Team</Link>
                </div>
              </>
            ) : (
              <div style={styles.emptyLive}>
                <FaFire style={styles.emptyIcon} />
                <h3>No Live Matches Right Now</h3>
                <p>Check upcoming matches or watch live streams</p>
                <Link to="/upcoming" style={styles.btnOutline}>Upcoming Matches</Link>
              </div>
            )
          ) : (
            liveStreams.length > 0 ? (
              <div style={styles.streamsGrid}>
                {liveStreams.map((stream, index) => (
                  <div key={stream._id || index} style={styles.streamCard}>
                    <div style={styles.streamPreview}>
                      <div style={styles.liveIndicator}>● LIVE</div>
                      <iframe 
                        src={stream.url} 
                        style={styles.streamIframe}
                        title="Live Stream"
                      />
                    </div>
                    <div style={styles.streamInfo}>
                      <h6 style={styles.streamTitle}>{stream.title}</h6>
                      <div style={styles.streamStats}>
                        <span>{stream.viewerCount || 0} viewers</span>
                        <span>{stream.category}</span>
                      </div>
                      <button style={styles.watchBtn}>Watch Live</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyLive}>
                <FaVideo style={styles.emptyIcon} />
                <h3>No Live Streams</h3>
                <p>Be the first to go live!</p>
                <button style={styles.btnOutline} onClick={() => window.location.href = '/go-live'}>
                  Start Streaming
                </button>
              </div>
            )
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%)" },
  topbar: {
    height: 70,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(226,232,240,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 20, flex: 1 },
  backBtn: {
    background: "rgba(248,250,252,0.8)",
    borderRadius: 12,
    padding: 12,
    color: "#64748b",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  brandLogo: { display: "flex", alignItems: "center", gap: 12 },
  brandName: { fontWeight: 800, fontSize: 20, color: "#1e293b", background: "linear-gradient(135deg, #ef4444, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  searchBox: {
    flex: 1,
    maxWidth: 420,
    display: "flex",
    alignItems: "center",
    background: "rgba(241,245,249,0.8)",
    borderRadius: 12,
    padding: "10px 20px",
    gap: 10,
    backdropFilter: "blur(10px)",
  },
  searchIcon: { color: "#94a3b8", fontSize: 16 },
  searchInput: {
    background: "none",
    border: "none",
    fontSize: 15,
    color: "#475569",
    flex: 1,
    fontFamily: "inherit",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 16 },
  goLiveBtn: {
    background: "linear-gradient(135deg, #ef4444, #f87171)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 25,
    fontWeight: 700,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  notifBtn: {
    background: "rgba(241,245,249,0.8)",
    borderRadius: 12,
    width: 46,
    height: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
  avatarBox: { cursor: "pointer" },
  avatar: {
    width: 42,
    height: 42,
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
  },
  tabHeader: {
    display: "flex",
    background: "#fff",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  tabBtn: {
    flex: 1,
    padding: "16px 24px",
    border: "none",
    background: "none",
    fontWeight: 700,
    fontSize: 16,
    color: "#64748b",
    cursor: "pointer",
    borderRadius: 12,
    transition: "all 0.3s",
  },
  tabActive: {
    background: "linear-gradient(135deg, #ef4444, #f87171)",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(239,68,68,0.3)",
  },
  mainFull: { padding: "40px 48px", maxWidth: "1600px", margin: "0 auto" },
  contentSection: { background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 12px 60px rgba(0,0,0,0.1)" },
  streamsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 24,
  },
  streamCard: {
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  streamPreview: {
    position: "relative",
    height: 240,
    background: "#000",
  },
  liveIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "rgba(239,68,68,0.9)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 12,
    zIndex: 2,
    boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
  },
  streamIframe: {
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: 0,
  },
  streamInfo: {
    padding: "24px",
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 12,
    lineHeight: 1.3,
  },
  streamStats: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
    fontSize: 14,
    color: "#64748b",
  },
  watchBtn: {
    background: "linear-gradient(135deg, #ef4444, #f87171)",
    color: "#fff",
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(239,68,68,0.4)",
  },
  emptyLive: {
    textAlign: "center",
    padding: "100px 60px",
  },
  emptyIcon: {
    fontSize: 96,
    color: "#f1f5f9",
    marginBottom: 32,
  },
  actionRow: {
    display: "flex",
    gap: 16,
    marginTop: 32,
    justifyContent: "center",
  },
  actionBtn: {
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    color: "#fff",
    padding: "16px 40px",
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  actionBtnSecondary: {
    background: "rgba(99,102,241,0.1)",
    color: "#6366f1",
    padding: "16px 40px",
    borderRadius: 14,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    border: "2px solid rgba(99,102,241,0.2)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  btnOutline: {
    background: "rgba(99,102,241,0.1)",
    color: "#6366f1",
    padding: "14px 32px",
    borderRadius: 12,
    fontWeight: 700,
    border: "2px solid rgba(99,102,241,0.2)",
    cursor: "pointer",
  },
};

export default Live;
