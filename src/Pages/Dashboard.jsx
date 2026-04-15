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
import { FaWallet, FaUsers, FaTrophy } from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    teams: 0,
    contests: 0
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
        getContests().catch(() => [])
      ]);
      
      setStats({
        balance: Number(balanceRes.balance || 0),
        teams: Array.isArray(teamsRes) ? teamsRes.length : 0,
        contests: Array.isArray(contestsRes) ? contestsRes.length : 0
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50 glass-container">
        <div className="spinner-border text-primary pulse-glow" style={{width: '4rem', height: '4rem'}} role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container app-container">
      <div className="container-fluid px-4 py-4">
        {/* Welcome Hero */}
        <div className="hero-welcome card-premium fade-in-up p-4 mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="welcome-title mb-2 h1">Welcome back, {user?.name || 'Player'}!</h1>
              <p className="lead text-gray-700 mb-0 fs-5">Here's what's happening in your Score11 world</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/create-team" className="btn btn-premium me-2 shadow-lg">Create Team</Link>
              <Link to="/join-contest" className="btn btn-premium bg-success text-white shadow-lg">Join Contest</Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card-premium hover-lift text-center p-4">
              <div className="stat-icon mb-3 mx-auto">
                <FaWallet />
              </div>
              <div className="stat-number h3 mb-2 score-highlight">₹{Number(stats.balance || 0).toLocaleString()}</div>
              <div className="stat-label h6 fw-semibold text-gray-600">Wallet Balance</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card-premium hover-lift text-center p-4">
              <div className="stat-icon mb-3 mx-auto bg-green-500 text-white">
                <FaUsers />
              </div>
              <div className="stat-number h3 mb-2">{stats.teams}</div>
              <div className="stat-label h6 fw-semibold text-gray-600">My Teams</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card-premium hover-lift text-center p-4">
              <div className="stat-icon mb-3 mx-auto bg-gold-500 text-white">
                <FaTrophy />
              </div>
              <div className="stat-number h3 mb-2">{stats.contests}</div>
              <div className="stat-label h6 fw-semibold text-gray-600">Active Contests</div>
            </div>
          </div>
        </div>

        {/* Header */}
        <Header />

        {/* Sections Grid */}
        <div className="section-grid fade-in-up">
          <LiveMatches />
          <UpcomingMatches />
          <Leaderboard />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="container-fluid px-4">
        {/* Welcome Hero */}
        <div className="hero-welcome fade-in-up">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="welcome-title mb-2">Welcome back, {user?.name || 'Player'}!</h1>
              <p className="lead text-gray-700 mb-0">Here's what's happening in your Score11 world</p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/create-team" className="btn btn-primary me-2">Create Team</Link>
              <Link to="/join-contest" className="btn btn-success">Join Contest</Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats row g-4 mb-5 fade-in-up">
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card hover-lift">
              <div className="stat-icon bg-blue-500 text-white">
                <FaWallet />
              </div>
              <div className="stat-number">₹{Number(stats.balance || 0).toLocaleString()}</div>
              <div className="stat-label">Wallet Balance</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card hover-lift">
              <div className="stat-icon bg-green-500 text-white">
                <FaUsers />
              </div>
              <div className="stat-number">{stats.teams}</div>
              <div className="stat-label">My Teams</div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 stat-card hover-lift">
              <div className="stat-icon bg-yellow-500 text-white">
                <FaTrophy />
              </div>
              <div className="stat-number">{stats.contests}</div>
              <div className="stat-label">Active Contests</div>
            </div>
          </div>
        </div>

        {/* Header */}
        <Header />

        {/* Sections Grid */}
        <div className="section-grid">
          <LiveMatches />
          <UpcomingMatches />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
