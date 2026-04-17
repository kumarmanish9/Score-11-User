import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import UpcomingMatches from "../Components/DashboardSection/UpcomingMatches";
import { getMatches } from "../Services/matchService";
import { getUserTeams } from "../Services/teamService";
import { FaCalendarAlt, FaSearch, FaFilter, FaBell, FaUserCircle, FaArrowLeft, FaTrophy } from "react-icons/fa";

function Upcoming() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, international, domestic
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ upcoming: 0, teamsReady: 0 });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [upcomingData, teamsData] = await Promise.all([
        getMatches('upcoming').catch(() => []),
        getUserTeams().catch(() => [])
      ]);
      let filtered = upcomingData;
      if (filter !== 'all') {
        filtered = upcomingData.filter(m => m.category === filter);
      }
      const filteredSearch = filtered.filter(m => 
        m.title?.toLowerCase().includes(search.toLowerCase()) ||
        m.teamA?.toLowerCase().includes(search.toLowerCase()) ||
        m.teamB?.toLowerCase().includes(search.toLowerCase())
      );
      setMatches(filteredSearch);
      setStats({
        upcoming: filteredSearch.length,
        teamsReady: Array.isArray(teamsData) ? teamsData.length : 0
      });
    } catch (error) {
      console.error("Upcoming matches error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} /></div>;
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
            <FaCalendarAlt style={{ color: "#6366f1", fontSize: 20 }} />
            <span style={styles.brandName}>Upcoming Matches ({stats.upcoming})</span>
          </div>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input 
              style={styles.searchInput} 
              placeholder="Search matches..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.filterBtn} onClick={() => document.getElementById('filterMenu').classList.toggle('show')}>
            <FaFilter size={16} />
            Filter
          </div>
          <div style={styles.notifBtn}>
            <FaBell style={{ fontSize: 16, color: "#64748b" }} />
            <span style={styles.notifDot}></span>
          </div>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {(user?.name || "P")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div id="filterMenu" style={styles.filterMenu} className="shadow-lg">
        <button style={styles.filterItem} onClick={() => {setFilter('all'); fetchData();}}>All Matches</button>
        <button style={styles.filterItem} onClick={() => {setFilter('international'); fetchData();}}>International</button>
        <button style={styles.filterItem} onClick={() => {setFilter('domestic'); fetchData();}}>Domestic</button>
        <button style={styles.filterItem} onClick={() => {setFilter('t20'); fetchData();}}>T20</button>
        <button style={styles.filterItem} onClick={() => {setFilter('odi'); fetchData();}}>ODI</button>
        <button style={styles.filterItem} onClick={() => {setFilter('test'); fetchData();}}>Test</button>
      </div>

      <main style={styles.mainFull}>
        {/* Stats Header */}
        <div style={styles.statsHeader}>
          <div style={styles.statHeaderItem}>
            <div style={styles.statHeaderValue}>{stats.upcoming}</div>
            <div style={styles.statHeaderLabel}>Upcoming Matches</div>
          </div>
          <div style={styles.statHeaderItem}>
            <div style={styles.statHeaderValue}>{stats.teamsReady}</div>
            <div style={styles.statHeaderLabel}>Ready Teams</div>
          </div>
          <Link to="/create-team" style={styles.ctaBtn}>
            <FaTrophy /> Create Team for Next Match
          </Link>
        </div>

        {/* Matches Grid */}
        <div style={styles.matchesGrid}>
          {matches.length === 0 ? (
            <div style={styles.emptyState}>
              <FaCalendarAlt style={styles.emptyIcon} />
              <h3>No Upcoming Matches</h3>
              <p>Check back soon for exciting upcoming matches</p>
              <Link to="/matches" style={styles.btnOutline}>View All Matches</Link>
            </div>
          ) : (
            <>
              <UpcomingMatches matches={matches} />
              <div style={styles.loadMore}>
                <button style={styles.loadMoreBtn} onClick={fetchData}>Load More Matches</button>
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; }
        
        .show { display: block !important; }
      `}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#f8fafc" },
  topbar: {
    height: 64,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 16, flex: 1 },
  backBtn: {
    background: "#f1f5f9",
    borderRadius: 10,
    padding: 10,
    color: "#64748b",
    cursor: "pointer",
  },
  brandLogo: { display: "flex", alignItems: "center", gap: 8 },
  brandName: { fontWeight: 800, fontSize: 18, color: "#1e293b" },
  searchBox: {
    flex: 1,
    maxWidth: 360,
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    borderRadius: 10,
    padding: "8px 16px",
    gap: 8,
  },
  searchIcon: { color: "#94a3b8", fontSize: 14 },
  searchInput: {
    background: "none",
    border: "none",
    fontSize: 14,
    color: "#475569",
    flex: 1,
    fontFamily: "inherit",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 16 },
  filterBtn: {
    background: "#f1f5f9",
    borderRadius: 10,
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#64748b",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    cursor: "pointer",
  },
  notifBtn: {
    background: "#f1f5f9",
    borderRadius: 10,
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    background: "#ef4444",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  avatarBox: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  avatar: {
    width: 38,
    height: 38,
    background: "linear-gradient(135deg,#6366f1,#818cf8)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
  },
  filterMenu: {
    display: "none",
    position: "fixed",
    top: 70,
    right: 28,
    background: "#fff",
    borderRadius: 12,
    padding: 8,
    zIndex: 1000,
    minWidth: 180,
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
  },
  filterItem: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    background: "none",
    textAlign: "left",
    fontWeight: 500,
    cursor: "pointer",
    borderRadius: 8,
  },
  mainFull: { padding: "32px 40px", maxWidth: "1600px", margin: "0 auto" },
  statsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  statHeaderItem: {
    textAlign: "center",
    padding: "20px",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  statHeaderValue: { fontSize: 36, fontWeight: 800, color: "#1e293b", marginBottom: 4 },
  statHeaderLabel: { fontSize: 14, color: "#94a3b8", fontWeight: 600 },
  ctaBtn: {
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    color: "#fff",
    padding: "16px 32px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
  },
  matchesGrid: { background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 40px rgba(0,0,0,0.06)" },
  emptyState: {
    textAlign: "center",
    padding: "80px 40px",
  },
  emptyIcon: {
    fontSize: 80,
    color: "#d1d5db",
    marginBottom: 24,
  },
  btnOutline: {
    background: "rgba(99,102,241,0.1)",
    color: "#6366f1",
    padding: "12px 28px",
    borderRadius: 10,
    fontWeight: 600,
    border: "2px solid rgba(99,102,241,0.2)",
  },
  loadMore: { textAlign: "center", marginTop: 40, paddingTop: 40, borderTop: "1px solid #f1f5f9" },
  loadMoreBtn: {
    background: "linear-gradient(135deg, #10b981, #34d399)",
    color: "#fff",
    padding: "16px 40px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
  },
};

export default Upcoming;
