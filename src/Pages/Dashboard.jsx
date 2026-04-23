import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Header from "../Components/DashboardSection/Header";
import LiveMatches from "../Components/DashboardSection/LiveMatches";
import UpcomingMatches from "../Components/DashboardSection/UpcomingMatches";
import Leaderboard from "../Components/DashboardSection/Leaderboard";
import { getWalletBalance } from "../Services/walletService";
import { getMyTeams } from "../Services/teamService";
import { getContests } from "../Services/contestService";
import { 
  FaWallet, FaUsers, FaTrophy, FaBell, FaSearch, FaChartLine, 
  FaFire, FaMedal, FaStar, FaArrowUp, FaCalendarAlt, FaCrown,
  FaArrowRight, FaPlus, FaUserFriends, FaGift, FaHeadset,

} from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .stat-card-anim {
    animation: fadeUp 0.4s ease both;
  }

  .quick-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    teams: 0,
    contests: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fullActions = [
    { label: "Deposit Funds", icon: "💰", color: "#6366f1", to: "/wallet" },
    { label: "My Portfolio", icon: "📊", color: "#10b981", to: "/portfolio" },
    { label: "Refer & Earn", icon: "🎁", color: "#f59e0b", to: "/refer-earn" },
    { label: "Support", icon: "💬", color: "#3b82f6", to: "/support" },
    { label: "Player List", icon: "👥", color: "#8b5cf6", to: "/instant-player-list" },
    { label: "Create Player", icon: "➕", color: "#ec4899", to: "/instant-player-create" },
    { label: "My Teams", icon: "🏏", color: "#f97316", to: "/team-history" },
    { label: "Create Match", icon: "⚽", color: "#ef4444", to: "/create-match" },
    { label: "Lineup Matches", icon: "⚾", color: "#8b5cf6", to: "/lineup" },
    { label: "Live Control", icon: "🎮", color: "#22c55e", to: "/my-matches" },
    { label: "Toss Screen", icon: "🎲", color: "#eab308", to: "/my-matches" }
  ];

  const guestActions = [
    { label: "Deposit Funds", icon: "💰", color: "#6366f1", to: "/wallet" },
    { label: "My Portfolio", icon: "📊", color: "#10b981", to: "/portfolio" },
    { label: "Refer & Earn", icon: "🎁", color: "#f59e0b", to: "/refer-earn" },
    { label: "Support", icon: "💬", color: "#3b82f6", to: "/support" }
  ];

  const quickActions = user ? fullActions : guestActions;

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [balanceRes, teamsRes, contestsRes] = await Promise.all([
        getWalletBalance().catch(() => ({ balance: 0 })),
        getMyTeams().catch(() => []),
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
      <div className="loading-container">
        <style>{styles}</style>
        <div className="custom-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        {/* Top Navigation Bar */}
        <nav className="top-nav">
          <div className="nav-left">
            <div className="brand">
              <FaCrown className="brand-icon" />
              <span className="brand-name">Score11</span>
            </div>
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input type="text" className="search-input" placeholder="Search matches, players..." />
            </div>
          </div>
          <div className="nav-right">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-dot"></span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || "Guest User"}</div>
                <div className="user-role">Pro Member</div>
              </div>
            </div>
          </div>
        </nav>

        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <Link to="/overview" className="sidebar-item active">
              <FaChartLine className="sidebar-icon" />
              <span>Overview</span>
              <span className="active-dot"></span>
            </Link>
            <Link to="/live" className="sidebar-item">
              <FaFire className="sidebar-icon" />
              <span>Live</span>
            </Link>
            <Link to="/upcoming" className="sidebar-item">
              <FaCalendarAlt className="sidebar-icon" />
              <span>Upcoming</span>
            </Link>
            <Link to="/contests" className="sidebar-item">
              <FaTrophy className="sidebar-icon" />
              <span>Contests</span>
            </Link>
            <Link to="/leaderboard" className="sidebar-item">
              <FaMedal className="sidebar-icon" />
              <span>Leaderboard</span>
            </Link>
            <div className="sidebar-divider"></div>
            <Link to="/create-team" className="sidebar-btn-primary">
              <FaPlus /> Create Team
            </Link>
            <Link to="/join-contest" className="sidebar-btn-success">
              Join Contest
            </Link>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            {/* Welcome Banner */}
            <div className="welcome-banner">
              <div className="banner-bg"></div>
              <div className="banner-content">
                <div>
                  <div className="welcome-tag">
                    <FaStar className="tag-icon" />
                    <span>Good morning!</span>
                  </div>
                  <h1 className="welcome-title">
                    Hey, {user?.name || "Player"}! 👋
                  </h1>
                  <p className="welcome-subtitle">
                    You have <strong className="text-primary">{stats.contests} active contests</strong> and{" "}
                    <strong className="text-success">{stats.teams} teams</strong> ready to play today.
                  </p>
                </div>
                <div className="banner-actions">
                  <Link to="/create-team" className="btn-primary">Create Team</Link>
                  <Link to="/join-contest" className="btn-outline">Join Contest</Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              {/* Wallet Card */}
              <div className="stat-card wallet-card">
                <div className="stat-header">
                  <div className="stat-icon wallet-icon">
                    <FaWallet />
                  </div>
                  <span className="stat-badge green">
                    <FaArrowUp className="badge-icon" /> 12%
                  </span>
                </div>
                <div className="stat-value">₹{Number(stats.balance || 0).toLocaleString()}</div>
                <div className="stat-label">Wallet Balance</div>
                <div className="progress-bar">
                  <div className="progress-fill wallet-fill" style={{ width: "60%" }}></div>
                </div>
              </div>

              {/* Teams Card */}
              <div className="stat-card teams-card">
                <div className="stat-header">
                  <div className="stat-icon teams-icon">
                    <FaUsers />
                  </div>
                  <span className="stat-badge success">
                    <FaArrowUp className="badge-icon" /> 3 new
                  </span>
                </div>
                <div className="stat-value">{stats.teams}</div>
                <div className="stat-label">My Teams</div>
                <div className="progress-bar">
                  <div className="progress-fill teams-fill" style={{ width: "40%" }}></div>
                </div>
              </div>

              {/* Contests Card */}
              <div className="stat-card contests-card">
                <div className="stat-header">
                  <div className="stat-icon contests-icon">
                    <FaTrophy />
                  </div>
                  <span className="stat-badge warning">
                    <FaFire className="badge-icon" /> Hot
                  </span>
                </div>
                <div className="stat-value">{stats.contests}</div>
                <div className="stat-label">Active Contests</div>
                <div className="progress-bar">
                  <div className="progress-fill contests-fill" style={{ width: "75%" }}></div>
                </div>
              </div>

              {/* Rank Card */}
              <div className="stat-card rank-card">
                <div className="stat-header">
                  <div className="stat-icon rank-icon">
                    <FaMedal />
                  </div>
                  <span className="stat-badge danger">Top 5%</span>
                </div>
                <div className="stat-value">#42</div>
                <div className="stat-label">Your Rank</div>
                <div className="progress-bar">
                  <div className="progress-fill rank-fill" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
{quickActions.map(({ label, icon, color, to }) => (
                <Link key={label} to={to} className="quick-btn" style={{ borderTopColor: color }}>
                  <span className="quick-icon">{icon}</span>
                  <span className="quick-label" style={{ color: color }}>{label}</span>
                </Link>
              ))}
            </div>

            {/* Header Component */}
            <div className="section-card">
              <Header />
            </div>

            {/* Live Matches & Upcoming */}
            <div className="sections-grid">
              <div className="section-card">
                <div className="section-header">
                  <div className="section-title">
                    <FaFire className="title-icon danger" /> Live Matches
                  </div>
                  <span className="live-badge">● LIVE</span>
                </div>
                <LiveMatches />
              </div>

              <div className="section-card">
                <div className="section-header">
                  <div className="section-title">
                    <FaCalendarAlt className="title-icon primary" /> Upcoming
                  </div>
                  <Link to="/matches" className="see-all-link">See All <FaArrowRight /></Link>
                </div>
                <UpcomingMatches />
              </div>

              <div className="section-card full-width">
                <div className="section-header">
                  <div className="section-title">
                    <FaTrophy className="title-icon warning" /> Leaderboard
                  </div>
                  <Link to="/leaderboard" className="see-all-link">Full Board <FaArrowRight /></Link>
                </div>
                <Leaderboard />
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          min-height: 100vh;
        }

        /* Top Navigation */
        .top-nav {
          background: white;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-icon {
          font-size: 24px;
          color: #f59e0b;
        }

        .brand-name {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        .search-input {
          width: 280px;
          padding: 10px 16px 10px 40px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-family: inherit;
          font-size: 13px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          position: relative;
          background: #f1f5f9;
          border: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: #e2e8f0;
        }

        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 16px;
        }

        .user-name {
          font-weight: 700;
          font-size: 14px;
          color: #1e293b;
        }

        .user-role {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        /* Layout */
        .dashboard-layout {
          display: flex;
          min-height: calc(100vh - 70px);
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e2e8f0;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 70px;
          height: calc(100vh - 70px);
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
        }

        .sidebar-item:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, #ede9fe, #e0e7ff);
          color: #6366f1;
        }

        .sidebar-icon {
          font-size: 16px;
        }

        .active-dot {
          margin-left: auto;
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
        }

        .sidebar-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 12px 0;
        }

        .sidebar-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          text-align: center;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          margin-top: 8px;
          transition: all 0.2s;
        }

        .sidebar-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .sidebar-btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          text-align: center;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .sidebar-btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 28px 32px;
          overflow-y: auto;
        }

        /* Welcome Banner */
        .welcome-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }

        .banner-bg {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 12px;
        }

        .tag-icon {
          font-size: 10px;
          color: #f59e0b;
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .text-primary {
          color: #818cf8;
        }

        .text-success {
          color: #34d399;
        }

        .banner-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 12px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
        }

        .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .wallet-card { border-top: 3px solid #6366f1; }
        .teams-card { border-top: 3px solid #10b981; }
        .contests-card { border-top: 3px solid #f59e0b; }
        .rank-card { border-top: 3px solid #ef4444; }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .wallet-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .teams-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .contests-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .rank-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .stat-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-badge.green { background: #ede9fe; color: #6366f1; }
        .stat-badge.success { background: #d1fae5; color: #059669; }
        .stat-badge.warning { background: #fef3c7; color: #d97706; }
        .stat-badge.danger { background: #fee2e2; color: #dc2626; }

        .badge-icon { font-size: 9px; }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .progress-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        .wallet-fill { background: linear-gradient(90deg, #6366f1, #818cf8); }
        .teams-fill { background: linear-gradient(90deg, #10b981, #34d399); }
        .contests-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .rank-fill { background: linear-gradient(90deg, #ef4444, #f87171); }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .quick-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-top: 3px solid;
          border-radius: 16px;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }

        .quick-icon {
          font-size: 24px;
        }

        .quick-label {
          font-size: 12px;
          font-weight: 700;
        }

        /* Section Cards */
        .sections-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .section-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .section-card.full-width {
          grid-column: 1 / -1;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .section-title {
          font-weight: 800;
          font-size: 16px;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-icon {
          font-size: 14px;
        }

        .title-icon.danger { color: #ef4444; }
        .title-icon.primary { color: #3b82f6; }
        .title-icon.warning { color: #f59e0b; }

        .live-badge {
          background: #fee2e2;
          color: #dc2626;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 30px;
          animation: pulse 2s infinite;
        }

        .see-all-link {
          font-size: 12px;
          font-weight: 700;
          color: #3b82f6;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .see-all-link:hover {
          text-decoration: underline;
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
        }

        .custom-spinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-text {
          margin-top: 20px;
          color: #64748b;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .quick-actions {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-actions {
            grid-template-columns: repeat(3, 1fr);
          }
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .top-nav {
            padding: 0 16px;
          }
          .search-wrapper {
            display: none;
          }
          .sidebar {
            display: none;
          }
          .main-content {
            padding: 20px;
          }
          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
          .welcome-title {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}

export default Dashboard;