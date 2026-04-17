import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Header from "../Components/DashboardSection/Header";
import LiveMatches from "../Components/DashboardSection/LiveMatches";
import UpcomingMatches from "../Components/DashboardSection/UpcomingMatches";
import Leaderboard from "../Components/DashboardSection/Leaderboard";
import "../Components/DashboardSection/Dashboard.css";
import { getWalletBalance } from "../Services/walletService";
import { getUserTeams } from "../Services/teamService";
import { getContests } from "../Services/contestService";
import { FaWallet, FaUsers, FaTrophy, FaBell, FaSearch, FaChartLine, FaFire, FaMedal, FaStar, FaArrowUp, FaCalendarAlt, FaCrown } from "react-icons/fa";

function Overview() {
  const [stats, setStats] = useState({
    balance: 0,
    teams: 0,
    contests: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [balanceRes, teamsRes, contestsRes] = await Promise.all([
        getWalletBalance().catch(() => ({ balance: 0 })),
        getUserTeams().catch(() => []),
        getContests().catch(() => []),
      ]);
      setStats({
        balance: Number(balanceRes.balance || 0),
        teams: Array.isArray(teamsRes) ? teamsRes.length : 0,
        contests: Array.isArray(contestsRes) ? contestsRes.length : 0,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinnerRing}></div>
          <div style={styles.spinnerLogo}>S11</div>
        </div>
        <p style={styles.loadingText}>Loading overview...</p>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <div style={styles.brandLogo}>
            <FaCrown style={{ color: "#f59e0b", fontSize: 18 }} />
            <span style={styles.brandName}>Score11 Overview</span>
          </div>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input style={styles.searchInput} placeholder="Search matches, players..." />
          </div>
        </div>
        <div style={styles.topbarRight}>
          <div style={styles.notifBtn}>
            <FaBell style={{ fontSize: 16, color: "#64748b" }} />
            <span style={styles.notifDot}></span>
          </div>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {(user?.name || "P")[0].toUpperCase()}
            </div>
            <div>
              <div style={styles.avatarName}>{user?.name || "Player"}</div>
              <div style={styles.avatarRole}>Pro Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Main Content */}
      <main style={styles.mainFull}>
        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <div style={styles.welcomeBannerBg}></div>
          <div style={styles.welcomeContent}>
            <div>
              <div style={styles.welcomeTag}>
                <FaStar style={{ color: "#f59e0b", fontSize: 11 }} />
                <span>Welcome to Overview!</span>
              </div>
              <h1 style={styles.welcomeTitle}>
                Hey, {user?.name || "Player"} 👋
              </h1>
              <p style={styles.welcomeSub}>
                You have <strong style={{ color: "#6366f1" }}>{stats.contests} active contests</strong> and{" "}
                <strong style={{ color: "#10b981" }}>{stats.teams} teams</strong> ready to play today.
              </p>
            </div>
            <div style={styles.welcomeActions}>
              <Link to="/create-team" style={styles.btnPrimary}>Create Team</Link>
              <Link to="/join-contest" style={styles.btnOutline}>Join Contest</Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsRow}>
          {/* Wallet */}
          <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
            <div style={styles.statCardHeader}>
              <div style={{ ...styles.statIconBox, background: "rgba(99,102,241,0.12)" }}>
                <FaWallet style={{ color: "#6366f1", fontSize: 20 }} />
              </div>
              <span style={{ ...styles.statBadge, background: "#ede9fe", color: "#6366f1" }}>
                <FaArrowUp style={{ fontSize: 9 }} /> 12%
              </span>
            </div>
            <div style={styles.statValue}>₹{Number(stats.balance || 0).toLocaleString()}</div>
            <div style={styles.statLabel}>Wallet Balance</div>
            <div style={styles.statBar}>
              <div style={{ ...styles.statBarFill, width: "60%", background: "linear-gradient(90deg,#6366f1,#818cf8)" }}></div>
            </div>
          </div>

          {/* Teams */}
          <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
            <div style={styles.statCardHeader}>
              <div style={{ ...styles.statIconBox, background: "rgba(16,185,129,0.12)" }}>
                <FaUsers style={{ color: "#10b981", fontSize: 20 }} />
              </div>
              <span style={{ ...styles.statBadge, background: "#d1fae5", color: "#059669" }}>
                <FaArrowUp style={{ fontSize: 9 }} /> 3 new
              </span>
            </div>
            <div style={styles.statValue}>{stats.teams}</div>
            <div style={styles.statLabel}>My Teams</div>
            <div style={styles.statBar}>
              <div style={{ ...styles.statBarFill, width: "40%", background: "linear-gradient(90deg,#10b981,#34d399)" }}></div>
            </div>
          </div>

          {/* Contests */}
          <div style={{ ...styles.statCard, ...styles.statCardGold }}>
            <div style={styles.statCardHeader}>
              <div style={{ ...styles.statIconBox, background: "rgba(245,158,11,0.12)" }}>
                <FaTrophy style={{ color: "#f59e0b", fontSize: 20 }} />
              </div>
              <span style={{ ...styles.statBadge, background: "#fef3c7", color: "#d97706" }}>
                <FaFire style={{ fontSize: 9 }} /> Hot
              </span>
            </div>
            <div style={styles.statValue}>{stats.contests}</div>
            <div style={styles.statLabel}>Active Contests</div>
            <div style={styles.statBar}>
              <div style={{ ...styles.statBarFill, width: "75%", background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }}></div>
            </div>
          </div>

          {/* Rank Card */}
          <div style={{ ...styles.statCard, ...styles.statCardRank }}>
            <div style={styles.statCardHeader}>
              <div style={{ ...styles.statIconBox, background: "rgba(239,68,68,0.10)" }}>
                <FaMedal style={{ color: "#ef4444", fontSize: 20 }} />
              </div>
              <span style={{ ...styles.statBadge, background: "#fee2e2", color: "#dc2626" }}>
                Top 5%
              </span>
            </div>
            <div style={styles.statValue}>#42</div>
            <div style={styles.statLabel}>Your Rank</div>
            <div style={styles.statBar}>
              <div style={{ ...styles.statBarFill, width: "88%", background: "linear-gradient(90deg,#ef4444,#f87171)" }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          {[
            { label: "Deposit Funds", icon: "💰", color: "#6366f1" },
            { label: "My Portfolio", icon: "📊", color: "#10b981" },
            { label: "Refer & Earn", icon: "🎁", color: "#f59e0b" },
            { label: "Support", icon: "💬", color: "#3b82f6" },
          ].map(({ label, icon, color }) => (
            <button key={label} style={{ ...styles.quickBtn, borderTop: `3px solid ${color}` }}>
              <span style={styles.quickBtnIcon}>{icon}</span>
              <span style={{ ...styles.quickBtnLabel, color }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Sections */}
        <div style={styles.sectionsGridFull}>
          <div style={styles.sectionCard}>
            <div style={styles.sectionCardHead}>
              <span style={styles.sectionCardTitle}>
                <FaFire style={{ color: "#ef4444" }} /> Live Matches
              </span>
              <span style={styles.livePill}>● LIVE</span>
            </div>
            <LiveMatches />
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionCardHead}>
              <span style={styles.sectionCardTitle}>
                <FaCalendarAlt style={{ color: "#6366f1" }} /> Upcoming
              </span>
              <Link to="/upcoming" style={styles.seeAll}>See All →</Link>
            </div>
            <UpcomingMatches />
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionCardHead}>
              <span style={styles.sectionCardTitle}>
                <FaTrophy style={{ color: "#f59e0b" }} /> Leaderboard
              </span>
              <Link to="/leaderboard" style={styles.seeAll}>Full Board →</Link>
            </div>
            <Leaderboard />
          </div>

          <div style={styles.sectionCard}>
            <Header />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; }
        a { text-decoration: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card-anim { animation: fadeUp 0.4s ease both; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}

// Same styles as Dashboard but mainFull for full width
const styles = {
  // ... (copy all styles from Dashboard.jsx)
  root: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    color: "#1e293b",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingSpinner: {
    position: "relative",
    width: 72,
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerRing: {
    position: "absolute",
    inset: 0,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  spinnerLogo: {
    fontWeight: 800,
    fontSize: 14,
    color: "#6366f1",
    letterSpacing: "-0.5px",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
  },
  topbar: {
    height: 64,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 28,
    paddingRight: 28,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
  },
  // ... all other styles identical to Dashboard
  mainFull: {
    padding: "28px 40px",
    maxWidth: "1400px",
    margin: "0 auto",
    overflowY: "auto",
  },
  sectionsGridFull: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: 24,
  },
  // Include ALL Dashboard styles here (statsRow, statCard, welcomeBanner, etc.)
  // Truncated for brevity - FULL COPY REQUIRED
};

export default Overview;
