import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { getWalletBalance } from '../Services/walletService';
import { getUserTeams } from '../Services/teamService';
import { FaLifeRing, FaHeadset, FaQuestionCircle, FaEnvelope, FaPhone, FaClock, FaStar, FaRocket, FaShieldAlt, FaUser, FaFileUpload, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

function Support() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ balance: 0, teams: 0, accountAge: 'New' });
  const [ticket, setTicket] = useState({ subject: '', message: '', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const styles = {
    root: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#f8fafc",
      color: "#1e293b",
      lineHeight: 1.6,
    },
    hero: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      padding: '40px 28px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0 0 24px 24px',
    },
    heroBg: {
      position: 'absolute',
      top: -50,
      right: -50,
      width: 150,
      height: 150,
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
    },
    heroContent: {
      maxWidth: 1200,
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    heroTag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 36,
      fontWeight: 800,
      color: 'white',
      marginBottom: 12,
      lineHeight: 1.2,
    },
    heroSub: {
      fontSize: 18,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 24,
      fontWeight: 500,
    },
    heroStats: {
      display: 'flex',
      gap: 32,
      alignItems: 'center',
    },
    heroStat: {
      background: 'rgba(255,255,255,0.15)',
      padding: '16px 24px',
      borderRadius: 16,
      backdropFilter: 'blur(10px)',
    },
    heroStatValue: {
      fontSize: 28,
      fontWeight: 800,
      color: 'white',
      marginBottom: 4,
    },
    heroStatLabel: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: 600,
    },
    mainContent: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 28px',
    },
    section: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 800,
      marginBottom: 24,
      color: '#1e293b',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 20,
    },
    actionCard: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '24px',
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      borderTop: '4px solid transparent',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      flexShrink: 0,
    },
    actionLabel: {
      fontSize: 16,
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: 4,
    },
    actionDesc: {
      fontSize: 13,
      color: '#64748b',
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: 28,
      marginBottom: 40,
    },
    formCard: {
      background: 'white',
      borderRadius: 20,
      padding: 32,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      border: '1px solid #f1f5f9',
    },
    infoCard: {
      background: 'white',
      borderRadius: 20,
      padding: 32,
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      border: '1px solid #f1f5f9',
    },
    cardHead: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 28,
      paddingBottom: 20,
      borderBottom: '1px solid #f1f5f9',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: '#1e293b',
      margin: 0,
    },
    badge: {
      background: '#dbeafe',
      color: '#1d4ed8',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    },
    input: {
      padding: '16px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: 14,
      fontSize: 15,
      fontFamily: 'inherit',
      transition: 'border-color 0.2s',
      background: 'white',
    },
    prefill: {
      padding: '12px 16px',
      background: '#f8fafc',
      borderRadius: 12,
      fontSize: 13,
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    editLink: {
      color: '#3b82f6',
      fontWeight: 600,
      textDecoration: 'none',
    },
    fileUpload: {
      position: 'relative',
    },
    fileInput: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
    },
    fileLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '16px 20px',
      border: '2px dashed #cbd5e1',
      borderRadius: 14,
      background: '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: 14,
      fontWeight: 500,
    },
    fileName: {
      display: 'block',
      marginTop: 8,
      fontSize: 13,
      color: '#10b981',
      fontWeight: 600,
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      padding: '18px',
      borderRadius: 14,
      fontSize: 16,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    successMsg: {
      background: '#dcfce7',
      color: '#166534',
      padding: '16px',
      borderRadius: 12,
      textAlign: 'center',
      fontWeight: 600,
      marginTop: 16,
    },
    infoItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      marginBottom: 24,
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    infoIcon: {
      fontSize: 20,
      color: '#10b981',
      width: 24,
      display: 'flex',
      alignItems: 'center',
    },
    infoHours: {
      fontSize: 13,
      color: '#64748b',
      marginBottom: 4,
    },
    infoTime: {
      fontSize: 16,
      fontWeight: 700,
      color: '#1e293b',
    },
  proBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      padding: '12px 20px',
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      marginTop: 20,
      border: '1px solid #fcd34d',
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [balanceRes, teamsRes] = await Promise.all([
        getWalletBalance().catch(() => ({ balance: 0 })),
        getUserTeams().catch(() => [])
      ]);
      setStats({
        balance: Number(balanceRes.balance || 0),
        teams: Array.isArray(teamsRes) ? teamsRes.length : 0,
        accountAge: user?.createdAt ? (new Date() - new Date(user.createdAt)) > 30*24*60*60*1000 ? 'Pro' : 'New' : 'New'
      });
    } catch (err) {
      console.error('Support stats error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setTicket({ subject: '', message: '', file: null });
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const quickActions = [
    { icon: FaQuestionCircle, label: 'FAQs', desc: 'Quick answers', color: '#6366f1', to: '/faq' },
    { icon: FaEnvelope, label: 'Email Us', desc: 'Detailed help', color: '#10b981', to: '/contact' },
    { icon: FaHeadset, label: 'Live Chat', desc: 'Instant support', color: '#f59e0b', onClick: () => alert('Chat opening...') },
    { icon: FaRocket, label: 'Upgrade Pro', desc: 'Priority support', color: '#ef4444', to: '/pro' }
  ];

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroBg}></div>
        <div style={styles.heroContent}>
          <div style={styles.heroTag}>
            <FaLifeRing style={{ color: '#fbbf24' }} />
            <span>Support Center</span>
          </div>
          <h1 style={styles.heroTitle}>Get Help Fast</h1>
          <p style={styles.heroSub}>We're here 24/7 to help you win more contests. Pro users get priority support! 🚀</p>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatValue}>#{user ? Math.floor(Math.random()*1000) : 42}</div>
              <div style={styles.heroStatLabel}>Support Rank</div>
            </div>
            <div style={styles.heroStat}>
              <FaClock style={{ color: '#10b981', fontSize: 20 }} />
              <div>Avg Response: 2 mins</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Quick Help */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Help</h2>
          <div style={styles.grid}>
            {quickActions.map(({ icon: Icon, label, desc, color, to, onClick }, i) => (
              <Link 
                key={label} 
                to={to} 
                style={{ ...styles.actionCard, borderTopColor: color, animationDelay: `${i*50}ms` }} 
                className="fade-in-up"
                onClick={onClick}
              >
                <div style={{ ...styles.actionIcon, backgroundColor: color + '20' }}>
                  <Icon style={{ color }} />
                </div>
                <div>
                  <div style={styles.actionLabel}>{label}</div>
                  <div style={styles.actionDesc}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Ticket Form */}
          <div style={styles.formCard}>
            <div style={styles.cardHead}>
              <FaShieldAlt style={{ color: '#3b82f6' }} />
              <h3 style={styles.cardTitle}>Submit Ticket</h3>
              <div style={styles.badge}>Priority: {stats.accountAge}</div>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input 
                style={styles.input} 
                placeholder="Subject (e.g. Can't create team)"
                value={ticket.subject}
                onChange={(e) => setTicket({...ticket, subject: e.target.value})}
                required
              />
              {user && (
                <div style={styles.prefill}>
                  <FaUser /> Pre-filled from {user.email} | <Link to="/profile" style={styles.editLink}>Edit Profile</Link>
                </div>
              )}
              <textarea 
                style={styles.input}
                placeholder="Describe your issue..."
                value={ticket.message}
                onChange={(e) => setTicket({...ticket, message: e.target.value})}
                required
                rows={5}
              />

              <div style={styles.fileUpload}>
                <input 
                  type="file" 
                  id="file" 
                  onChange={(e) => setTicket({...ticket, file: e.target.files[0]})} 
                  style={styles.fileInput}
                />
                <label htmlFor="file" style={styles.fileLabel}>
                  <FaFileUpload /> Attach Screenshot
                </label>
                {ticket.file && <span style={styles.fileName}>{ticket.file.name}</span>}
              </div>
              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? 'Sending...' : success ? <FaCheckCircle style={{ color: '#10b981' }} /> : 'Submit Ticket'}
              </button>
              {success && <div style={styles.successMsg}>Ticket created! Response within 2 hours. 🎉</div>}
            </form>
          </div>

          {/* Contact Info */}
          <div style={styles.infoCard}>
            <div style={styles.cardHead}>
              <FaPhone style={{ color: '#10b981' }} />
              <h3 style={styles.cardTitle}>Contact Info</h3>
            </div>
            <div style={styles.infoItems}>
              <div style={styles.infoItem}>
                <FaPhone style={styles.infoIcon} />
                <div>+91 98765 43210</div>
              </div>
              <div style={styles.infoItem}>
                <FaEnvelope style={styles.infoIcon} />
                <div>support@score11.com</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoHours}>Live Chat Hours</div>
                <div style={styles.infoTime}>24/7 • Response  2 min</div>
              </div>
            </div>
            {stats.balance > 0 && (
              <div style={styles.proBadge}>
                <FaStar style={{ color: '#fbbf24' }} />
                Pro Account Detected • Priority Support Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;


