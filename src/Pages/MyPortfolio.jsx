import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FaTrophy, FaWallet, FaChartLine, FaUsers, FaMedal, FaCrown, FaStar, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function MyPortfolio() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalWinnings: 0,
    currentBalance: 0,
    totalContests: 0,
    winRate: 0,
    rank: 0,
    teams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioStats();
  }, []);

  const fetchPortfolioStats = async () => {
    try {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setStats({
          totalInvested: 12500,
          totalWinnings: 28450,
          currentBalance: 15620,
          totalContests: 247,
          winRate: 42.3,
          rank: 127,
          teams: 89
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Portfolio stats error:', error);
      setLoading(false);
    }
  };

  const PortfolioCard = ({ icon: Icon, title, value, change, isPositive, subtitle }) => (
    <div style={styles.portfolioCard}>
      <div style={styles.cardHeader}>
        <div style={styles.cardIcon}>
          <Icon />
        </div>
        <div style={styles.changeIndicator} data-positive={isPositive}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          <span>{change}%</span>
        </div>
      </div>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardSubtitle}>{subtitle}</div>
      <div style={styles.cardTitle}>{title}</div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinnerRing}></div>
          <span>S11</span>
        </div>
        <p>Loading your portfolio...</p>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
        .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroTag}>
            <FaCrown style={{ color: '#fbbf24' }} />
            My Portfolio
          </div>
          <h1 style={styles.heroTitle}>Your Cricket Journey</h1>
          <p style={styles.heroSubtitle}>
            Track your performance, winnings, and growth. Level up your game! 🏆
          </p>
          <div style={styles.heroStats}>
            <div>
              <div style={styles.heroStatValue}>₹{stats.totalWinnings.toLocaleString()}</div>
              <div style={styles.heroStatLabel}>Total Winnings</div>
            </div>
            <div style={styles.divider}></div>
            <div>
              <div style={styles.heroStatValue}>{stats.winRate}%</div>
              <div style={styles.heroStatLabel}>Win Rate</div>
            </div>
            <div style={styles.divider}></div>
            <div>
              <div style={styles.heroStatValue}>#{stats.rank}</div>
              <div style={styles.heroStatLabel}>Global Rank</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Key Metrics */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Metrics</h2>
          <div style={styles.metricsGrid}>
            <PortfolioCard
              icon={FaWallet}
              title="Total Invested"
              value="₹12,500"
              change={12.5}
              isPositive={true}
              subtitle="This month"
            />
            <PortfolioCard
              icon={FaTrophy}
              title="Total Winnings"
              value="₹28,450"
              change={28.4}
              isPositive={true}
              subtitle="Lifetime"
            />
            <PortfolioCard
              icon={FaChartLine}
              title="ROI"
              value="+127.6%"
              change={27.6}
              isPositive={true}
              subtitle="vs last month"
            />
            <PortfolioCard
              icon={FaUsers}
              title="Active Teams"
              value={stats.teams}
              change={3}
              isPositive={true}
              subtitle="This week"
            />
          </div>
        </div>

        {/* Performance Breakdown */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Performance Breakdown</h2>
          <div style={styles.performanceGrid}>
            <div style={styles.performanceCard}>
              <div style={styles.performanceHeader}>
                <FaMedal style={styles.performanceIcon} />
                <span>Contest Stats</span>
              </div>
              <div style={styles.performanceStats}>
                <div>
                  <div style={styles.statBig}>{stats.totalContests}</div>
                  <div>Total Contests</div>
                </div>
                <div>
                  <div style={styles.statBig}>{stats.winRate}%</div>
                  <div>Win Rate</div>
                </div>
                <div>
                  <div style={styles.statBig}>#{stats.rank}</div>
                  <div>Rank</div>
                </div>
              </div>
            </div>

            <div style={styles.performanceCard}>
              <div style={styles.performanceHeader}>
                <FaChartLine style={styles.performanceIcon} />
                <span>Financial Summary</span>
              </div>
              <div style={styles.performanceStats}>
                <div>
                  <div style={styles.statBig}>₹{stats.currentBalance.toLocaleString()}</div>
                  <div>Current Balance</div>
                </div>
                <div>
                  <div style={styles.statBig}>₹{stats.totalWinnings.toLocaleString()}</div>
                  <div>Total Earnings</div>
                </div>
                <div>
                  <div style={styles.statBig}>+₹15,620</div>
                  <div>Net Profit</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Activity</h2>
            <Link to="/activity" style={styles.sectionLink}>View All →</Link>
          </div>
          <div style={styles.activityList}>
            {activityData.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityIcon} data-type={activity.type}>
                  {activity.icon}
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityTitle}>{activity.title}</div>
                  <div style={styles.activityDesc}>{activity.desc}</div>
                </div>
                <div style={styles.activityTime}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div style={styles.upgradeSection}>
          <div style={styles.upgradeContent}>
            <FaStar style={styles.upgradeIcon} />
            <h3>Go Pro for Better Insights</h3>
            <p>Unlock advanced analytics, priority support & exclusive contests</p>
            <Link to="/pro" style={styles.upgradeBtn}>Upgrade Now</Link>
          </div>
        </div>
      </div>
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
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 32px",
    borderRadius: "0 0 24px 24px",
    marginBottom: 32,
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    maxWidth: 1200,
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  heroTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.2)",
    color: "white",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: "white",
    marginBottom: 12,
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 32,
    fontWeight: 500,
  },
  heroStats: {
    display: "flex",
    gap: 40,
    alignItems: "flex-end",
  },
  heroStatValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "white",
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
  },
  divider: {
    width: 1,
    height: 40,
    background: "rgba(255,255,255,0.3)",
  },
  mainContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px 40px",
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 24,
    color: "#1e293b",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  portfolioCard: {
    background: "white",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  changeIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 12,
    background: "#10b981",
    color: "white",
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#475569",
  },
  performanceGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  performanceCard: {
    background: "white",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  },
  performanceHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    fontWeight: 700,
    fontSize: 16,
    color: "#1e293b",
  },
  performanceIcon: {
    color: "#6366f1",
    fontSize: 20,
  },
  performanceStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
  },
  statBig: {
    fontSize: 28,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
  },
  activityList: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
    overflow: "hidden",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "20px 24px",
    borderBottom: "1px solid #f8fafc",
    transition: "background 0.15s",
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
    color: "#64748b",
  },
  activityTime: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 600,
    minWidth: 80,
    textAlign: "right",
  },
  upgradeSection: {
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    borderRadius: 20,
    padding: 32,
    marginTop: 32,
    textAlign: "center",
    border: "1px solid #fcd34d",
  },
  upgradeIcon: {
    fontSize: 48,
    color: "#f59e0b",
    marginBottom: 16,
  },
  'upgradeContent h3': {
    fontSize: 22,
    fontWeight: 800,
    color: "#92400e",
    marginBottom: 12,
  },
  'upgradeContent p': {
    fontSize: 15,
    color: "#92400e",
    marginBottom: 24,
    fontWeight: 500,
  },
  upgradeBtn: {
    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    color: "white",
    padding: "14px 32px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    gap: 20,
  },
  loadingSpinner: {
    position: "relative",
    width: 80,
    height: 80,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

const activityData = [
  { type: "win", icon: "🏆", title: "Won ₹250 Prize", desc: "Mega T20 Contest #124", time: "2h ago" },
  { type: "team", icon: "⚡", title: "Created New Team", desc: "IND vs AUS Final", time: "4h ago" },
  { type: "deposit", icon: "💰", title: "Added ₹500", desc: "UPI Payment", time: "1d ago" },
  { type: "loss", icon: "📉", title: "Contest Ended", desc: "Rank #45/100", time: "2d ago" },
  { type: "referral", icon: "👥", title: "Referral Bonus", desc: "Friend joined", time: "3d ago" },
];

export default MyPortfolio;
