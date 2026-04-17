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

function Dashboard() {
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
        <p style={styles.loadingText}>Loading your dashboard...</p>
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
            <span style={styles.brandName}>Score11</span>
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

      <div style={styles.pageBody}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <Link to="/overview" style={{ ...styles.sidebarItem, ...styles.sidebarItemActive }}>
            <FaChartLine style={styles.sidebarIcon} />
            <span style={styles.sidebarLabel}>Overview</span>
            <span style={styles.sidebarActiveDot}></span>
          </Link>
          <Link to="/live" style={styles.sidebarItem}>
            <FaFire style={styles.sidebarIcon} />
            <span style={styles.sidebarLabel}>Live</span>
          </Link>
          <Link to="/upcoming" style={styles.sidebarItem}>
            <FaCalendarAlt style={styles.sidebarIcon} />
            <span style={styles.sidebarLabel}>Upcoming</span>
          </Link>
          <Link to="/contests" style={styles.sidebarItem}>
            <FaTrophy style={styles.sidebarIcon} />
            <span style={styles.sidebarLabel}>Contests</span>
          </Link>
          <Link to="/leaderboard" style={styles.sidebarItem}>
            <FaMedal style={styles.sidebarIcon} />
            <span style={styles.sidebarLabel}>Leaderboard</span>
          </Link>
          <div style={styles.sidebarDivider}></div> 
          <Link to="/create-team" style={styles.sidebarCta}>
            + Create Team
          </Link>
          <Link to="/join-contest" style={styles.sidebarCtaGreen}>
            Join Contest
          </Link>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Welcome Banner */}
          <div style={styles.welcomeBanner}>
            <div style={styles.welcomeBannerBg}></div>
            <div style={styles.welcomeContent}>
              <div>
                <div style={styles.welcomeTag}>
                  <FaStar style={{ color: "#f59e0b", fontSize: 11 }} />
                  <span>Good morning!</span>
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

{/* Quick Actions Strip */}
<div style={styles.quickActions}>
{[
    { label: "Deposit Funds", icon: "💰", color: "#6366f1" },
    { label: "My Portfolio", icon: "📊", to: "/portfolio", color: "#10b981" },
    { label: "Refer & Earn", icon: "🎁", to: "/refer-earn", color: "#f59e0b" },
    { label: "Support", icon: "💬", to: "/support", color: "#3b82f6" },
    { label: "Player List", icon: "👥", to: "/instant-player-list", color: "#8b5cf6" },
    { label: "Create Player", icon: "➕", to: "/instant-player-create", color: "#ec4899" },
{ label: "My Teams", icon: "🏏", to: "/team-history", color: "#f97316" },
    { label: "Create Match", icon: "⚽", to: "/create-match", color: "#ef4444" },
    { label: "Live Control", icon: "🎮", to: "/match/123/live-control", color: "#22c55e" }  ,
    { label: "Toss Screen", icon: "🎲", to: "/match/123/toss", color: "#eab308" }
  ].map(({ label, icon, color, to }) => (
              to ? (
                <Link 
                  key={label} 
                  to={to} 
                  style={{ 
                    ...styles.quickBtn, 
                    borderTop: `3px solid ${color}`,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span style={styles.quickBtnIcon}>{icon}</span>
                  <span style={{ ...styles.quickBtnLabel, color }}>{label}</span>
                </Link>
              ) : (
                <button key={label} style={{ ...styles.quickBtn, borderTop: `3px solid ${color}` }}>
                  <span style={styles.quickBtnIcon}>{icon}</span>
                  <span style={{ ...styles.quickBtnLabel, color }}>{label}</span>
                </button>
              )
            ))}

          </div>

          {/* Header Component */}
          <div style={styles.sectionCard}>
            <Header />
          </div>

          {/* Sections Grid */}
          <div style={styles.sectionsGrid}>
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
                <Link to="/matches" style={styles.seeAll}>See All →</Link>
              </div>
              <UpcomingMatches />
            </div>

            <div style={{ ...styles.sectionCard, gridColumn: "1 / -1" }}>
              <div style={styles.sectionCardHead}>
                <span style={styles.sectionCardTitle}>
                  <FaTrophy style={{ color: "#f59e0b" }} /> Leaderboard
                </span>
                <Link to="/leaderboard" style={styles.seeAll}>Full Board →</Link>
              </div>
              <Leaderboard />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; }
        a { text-decoration: none; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card-anim { animation: fadeUp 0.4s ease both; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}

const styles = {
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
  // Topbar
  topbar: {
    height: 64,
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 24,
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 20 },
  brandLogo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },
  brandName: {
    fontWeight: 800,
    fontSize: 20,
    color: "#1e293b",
    letterSpacing: "-0.5px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    borderRadius: 10,
    padding: "8px 14px",
    gap: 8,
    width: 260,
  },
  searchIcon: { color: "#94a3b8", fontSize: 13 },
  searchInput: {
    background: "none",
    border: "none",
    fontSize: 13,
    color: "#475569",
    width: "100%",
    fontFamily: "inherit",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 16 },
  notifBtn: {
    position: "relative",
    background: "#f1f5f9",
    borderRadius: 10,
    width: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  avatarBox: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
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
  avatarName: { fontWeight: 700, fontSize: 13, color: "#1e293b" },
  avatarRole: { fontSize: 11, color: "#94a3b8", fontWeight: 500 },

  // Layout
  pageBody: { display: "flex", minHeight: "calc(100vh - 64px)" },

  // Sidebar
  sidebar: {
    width: 210,
    background: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    position: "sticky",
    top: 64,
    height: "calc(100vh - 64px)",
    overflowY: "auto",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "none",
    cursor: "pointer",
    width: "100%",
    color: "#64748b",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 13,
    position: "relative",
    transition: "all 0.15s",
  },
  sidebarItemActive: {
    background: "linear-gradient(135deg,#ede9fe,#e0e7ff)",
    color: "#6366f1",
  },
  sidebarIcon: { fontSize: 14, width: 18, display: "flex", alignItems: "center", justifyContent: "center" },
  sidebarLabel: {},
  sidebarActiveDot: {
    width: 6,
    height: 6,
    background: "#6366f1",
    borderRadius: "50%",
    marginLeft: "auto",
  },
  sidebarDivider: { height: 1, background: "#f1f5f9", margin: "12px 0" },
  sidebarCta: {
    display: "block",
    background: "linear-gradient(135deg,#6366f1,#818cf8)",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 8,
    letterSpacing: "0.2px",
  },
  sidebarCtaGreen: {
    display: "block",
    background: "linear-gradient(135deg,#10b981,#34d399)",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.2px",
  },

  // Main
  main: { flex: 1, padding: "28px 28px", overflowY: "auto" },

  // Welcome Banner
  welcomeBanner: {
    background: "linear-gradient(130deg,#6366f1 0%,#818cf8 50%,#a5b4fc 100%)",
    borderRadius: 18,
    padding: "28px 32px",
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  welcomeBannerBg: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    background: "rgba(255,255,255,0.08)",
    borderRadius: "50%",
  },
  welcomeContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  welcomeTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 6,
    letterSpacing: "-0.5px",
  },
  welcomeSub: { fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 },
  welcomeActions: { display: "flex", gap: 10, flexShrink: 0 },
  btnPrimary: {
    background: "#fff",
    color: "#6366f1",
    padding: "10px 22px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  },
  btnOutline: {
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
    border: "1.5px solid rgba(255,255,255,0.4)",
    whiteSpace: "nowrap",
  },

  // Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "20px 20px 16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    animation: "fadeUp 0.4s ease both",
  },
  statCardBlue: { borderTop: "3px solid #6366f1" },
  statCardGreen: { borderTop: "3px solid #10b981" },
  statCardGold: { borderTop: "3px solid #f59e0b" },
  statCardRank: { borderTop: "3px solid #ef4444" },
  statCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1e293b",
    letterSpacing: "-0.5px",
    marginBottom: 2,
  },
  statLabel: { fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12 },
  statBar: { height: 4, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" },
  statBarFill: { height: "100%", borderRadius: 4, transition: "width 0.6s ease" },

  // Quick Actions
  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 20,
  },
  quickBtn: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "box-shadow 0.15s, transform 0.15s",
    fontFamily: "inherit",
  },
  quickBtnIcon: { fontSize: 22 },
  quickBtnLabel: { fontSize: 12, fontWeight: 700 },

  // Section Cards
  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 16,
  },
  sectionCard: {
    background: "#ffffff",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    marginBottom: 16,
  },
  sectionCardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid #f1f5f9",
  },
  sectionCardTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  livePill: {
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 20,
    animation: "fadeUp 1s ease infinite alternate",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6366f1",
  },
};

export default Dashboard;