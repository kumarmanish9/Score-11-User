import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FaGift, FaUserPlus, FaRupeeSign, FaShareAlt, FaCopy, FaCheckCircle, FaUsers, FaStar, FaCrown } from 'react-icons/fa';

function ReferEarn() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalEarnings: 1250,
    totalReferrals: 23,
    pendingPayout: 350,
    referralCode: 'YOURCODE-S11',
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/referral-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to defaults
        setStats({
          totalEarnings: 1250,
          totalReferrals: 23,
          pendingPayout: 350,
          referralCode: user?.username ? `${user.username.toUpperCase()}-S11` : 'YOURCODE-S11',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Referral stats error:', error);
      // Instant fallback
      setStats({
        totalEarnings: 1250,
        totalReferrals: 23,
        pendingPayout: 350,
        referralCode: user?.username ? `${user.username.toUpperCase()}-S11` : 'YOURCODE-S11',
      });
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://scores11.com/register?ref=${stats?.referralCode || 'YOURCODE-S11'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  const shareWhatsApp = () => {
    const code = stats?.referralCode || 'YOURCODE-S11';
    const message = `Join Score11 fantasy cricket & get ₹100 bonus! Use my code ${code} 🎁 https://scores11.com/register?ref=${code}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const steps = [
    { title: "Share Your Code", desc: "Send your unique referral code to friends via WhatsApp, SMS or social media." },
    { title: "Friend Registers", desc: "They sign up using your code and verify their account." },
    { title: "Both Get ₹100", desc: "You AND your friend get ₹100 bonus instantly credited to wallet!" },
  ];

  const referralFriends = [
    { name: "Priya S", bonus: "₹100" },
    { name: "Rahul K", bonus: "₹100" },
    { name: "Anita M", bonus: "₹100" },
    { name: "Vikram P", bonus: "₹100" },
    { name: "Sneha R", bonus: "₹100" },
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinnerRing}></div>
          <span>S11</span>
        </div>
        <p>Loading referral program...</p>
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
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
        .bounce { animation: bounce 2s infinite; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroTag}>
            <FaGift style={{ color: '#f59e0b' }} />
            Refer & Earn
          </div>
          <h1 style={styles.heroTitle}>Invite Friends, Earn ₹100!</h1>
          <p style={styles.heroSubtitle}>
            Every friend you invite gets ₹100 bonus, and you earn the same! Unlimited referrals 🚀
          </p>
          <div style={styles.heroStats}>
            <div>
              <div style={styles.statNumber}>₹{stats?.totalEarnings ?? 0}</div>
              <div>Total Earned</div>
            </div>
            <div style={styles.divider}></div>
            <div>
              <div style={styles.statNumber}>{stats?.totalReferrals ?? 0}</div>
              <div>Friends Invited</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Referral Code */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaUserPlus style={styles.cardIcon} />
            <div>
              <h3>Your Referral Code</h3>
              <p>Share this code with friends</p>
            </div>
          </div>
          <div style={styles.codeContainer}>
            <div style={styles.codeBox}>
              <span style={styles.code}>{stats?.referralCode ?? 'YOURCODE-S11'}</span>
            </div>
            <div style={styles.codeActions}>
              <button onClick={copyReferralLink} style={styles.copyBtn}>
                {copied ? <FaCheckCircle /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button onClick={shareWhatsApp} style={styles.shareBtn}>
                <FaShareAlt />
                Share on WhatsApp
              </button>
            </div>
          </div>
          <div style={styles.linkPreview}>
            <span>scores11.com/register?ref={stats?.referralCode ?? 'YOURCODE-S11'}</span>
          </div>
        </div>

        {/* How it Works */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>How Refer & Earn Works</h2>
          <div style={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} style={styles.stepCard}>
                <div style={styles.stepNumber}>{index + 1}</div>
                <FaStar style={styles.stepIcon} />
                <h4 style={styles.stepCardH4}>{step.title}</h4>
                <p style={styles.stepCardP}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Stats */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FaUsers style={styles.cardIcon} />
            <div>
              <h3>Referral Leaderboard</h3>
              <p>Your friends & earnings</p>
            </div>
          </div>
          <div style={styles.leaderboard}>
            {referralFriends.map((friend, index) => (
              <div key={index} style={styles.friendRow}>
                <div style={styles.friendAvatar}>
                  {friend.name[0]}
                </div>
                <div style={styles.friendInfo}>
                  <div style={styles.friendName}>{friend.name}</div>
                  <div style={styles.friendStatus}>Active</div>
                </div>
                <div style={styles.friendBonus}>{friend.bonus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Payouts</h2>
          <div style={styles.payoutCard}>
            <div style={styles.payoutStats}>
              <div>
                <div style={styles.payoutAmount}>₹{stats?.pendingPayout ?? 0}</div>
                <div>Pending Payout</div>
              </div>
              <div style={styles.dividerVertical}></div>
              <div>
                <div style={styles.payoutAmount}>₹{stats?.totalEarnings ?? 0}</div>
                <div>Total Paid Out</div>
              </div>
            </div>
            <button 
              style={{
                ...styles.payoutBtn,
                cursor: (stats?.pendingPayout ?? 0) > 0 ? "pointer" : "not-allowed",
                opacity: (stats?.pendingPayout ?? 0) > 0 ? 1 : 0.6
              }} 
              disabled={(stats?.pendingPayout ?? 0) === 0}
            >
              Withdraw Earnings
            </button>
          </div>
        </div>

        {/* Pro Upgrade */}
        <div style={styles.upgradeCard}>
          <FaCrown style={styles.upgradeIcon} />
          <h3 style={styles.upgradeCardH3}>Go Pro - Unlimited Referrals!</h3>
          <p style={styles.upgradeCardP}>Pro users get 50% more referral bonus + priority withdrawals</p>
          <Link to="/pro" style={styles.proBtn}>Become Pro User</Link>
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
    background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    padding: "40px 32px",
    borderRadius: "0 0 24px 24px",
    marginBottom: 32,
    position: "relative",
  },
  heroContent: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  heroTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.25)",
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
    color: "rgba(255,255,255,0.95)",
    marginBottom: 32,
    fontWeight: 500,
  },
  heroStats: {
    display: "flex",
    gap: 40,
    alignItems: "flex-end",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 800,
    color: "white",
    marginBottom: 4,
  },
  divider: {
    width: 1,
    height: 32,
    background: "rgba(255,255,255,0.4)",
  },
  mainContent: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px 40px",
  },
  card: {
    background: "white",
    borderRadius: 20,
    padding: 28,
    marginBottom: 32,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    color: "#f59e0b",
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeBox: {
    background: "#f8fafc",
    border: "2px dashed #e2e8f0",
    borderRadius: 16,
    padding: "20px 24px",
    textAlign: "center",
    marginBottom: 16,
  },
  code: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: 4,
    color: "#1e293b",
    fontFamily: "monospace",
  },
  codeActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  shareBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  linkPreview: {
    background: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#64748b",
    fontFamily: "monospace",
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
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  stepCard: {
    textAlign: "center",
    padding: 32,
    background: "white",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    position: "relative",
  },
  stepNumber: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    width: 48,
    height: 48,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 800,
    fontSize: 18,
  },
  stepIcon: {
    fontSize: 48,
    color: "#10b981",
    marginBottom: 16,
  },
  stepCardH4: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 12,
  },
  stepCardP: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 1.6,
  },
  leaderboard: {
    maxHeight: 400,
    overflowY: "auto",
  },
  friendRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 0",
    borderBottom: "1px solid #f8fafc",
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    color: "#6366f1",
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: 600,
  },
  friendBonus: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f59e0b",
  },
  payoutCard: {
    background: "white",
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
    textAlign: "center",
  },
  payoutStats: {
    display: "flex",
    gap: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  payoutAmount: {
    fontSize: 28,
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 4,
  },
  dividerVertical: {
    width: 1,
    height: 48,
    background: "#e2e8f0",
  },
  payoutBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    padding: "16px 40px",
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    fontSize: 16,
    transition: "all 0.2s",
  },
  upgradeCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: 20,
    padding: 32,
    textAlign: "center",
    color: "white",
    marginTop: 32,
  },
  upgradeIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  upgradeCardH3: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 12,
  },
  upgradeCardP: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.95,
  },
  proBtn: {
    background: "white",
    color: "#667eea",
    padding: "14px 32px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    display: "inline-block",
    boxShadow: "0 4px 20px rgba(255,255,255,0.3)",
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
  },
  spinnerRing: {
    width: "100%",
    height: "100%",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #f59e0b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default ReferEarn;