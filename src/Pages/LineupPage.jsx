import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyMatches } from "../Services/matchService";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f3",
    padding: "1.5rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "0.5px solid rgba(0,0,0,0.12)",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "18px", 
    fontWeight: 500,
    flex: 1,
    color: "#1a1a1a",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#3B6D11",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 500,
    borderRadius: "99px",
    padding: "2px 8px",
    marginLeft: "8px",
  },
  filterTabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  tabBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "white",
  },
  tabActive: {
    background: "#3B6D11",
    color: "white",
    borderColor: "#3B6D11",
  },
  btnBase: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "0.5px solid rgba(0,0,0,0.2)",
    background: "#fff",
    color: "#333",
    transition: "background 0.15s",
  },
  btnLineup: {
    background: "#3B6D11",
    borderColor: "#3B6D11", 
    color: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  btnLive: {
    background: "#dc2626",
    borderColor: "#dc2626",
    color: "#fff",
  },
  btnOutline: {
    background: "transparent",
    border: "0.5px solid rgba(0,0,0,0.2)",
    color: "#555",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: "12px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  teams: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#1a1a1a",
  },
  vs: {
    fontSize: "12px",
    color: "#888",
    margin: "0 6px",
    fontWeight: 400,
  },
  badgeStatus: (status) => ({
    display: "inline-block",
    background: status === 'scheduled' ? "#FAC775" : 
                status === 'team_selecting' ? "#3B82F6" : "#10B981",
    color: status === 'scheduled' ? "#633806" : 
           status === 'team_selecting' ? "white" : "white",
    borderRadius: "6px",
    padding: "2px 8px", 
    fontSize: "11px",
    fontWeight: 500,
    marginTop: "5px",
  }),
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "#666",
  },
  formatPill: {
    fontSize: "11px",
    color: "#aaa",
    marginTop: "2px",
  },
  actions: {
    display: "flex", 
    gap: "8px",
    marginTop: "auto",
  },
  emptyBox: {
    textAlign: "center",
    padding: "4rem 1rem",
    color: "#888",
  },
};

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLineup = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12v2H2V4zm0 4h12v2H2V8zm0 4h12v2H2v-2z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
  </svg>
);
const IconLive = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <circle cx="8" cy="8" r="2" fill="currentColor"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

function LineupPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'scheduled', 'ready'
  const navigate = useNavigate();

  const fetchLineupMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch scheduled + team_selecting matches
      const data = await getMyMatches({ 
        status: ['scheduled', 'team_selecting'] 
      });
      let lineupMatches = (data || [])
        .filter(match => {
          if (!match?._id || typeof match._id !== 'string' || match._id.length !== 24) {
            console.warn('Filtering invalid match:', match?._id);
            return false;
          }
          return ['scheduled', 'team_selecting'].includes(match.status);
        })
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      setMatches(lineupMatches);
    } catch (error) {
      console.error("Error fetching lineup matches:", error);
      setError(error.response?.data?.message || 'Failed to load matches. Please refresh or check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetLineups = (match) => {
    navigate(`/match/${match._id}/lineup`);
  };

  const handleLiveControl = (match) => {
    navigate(`/match/${match._id}/live-control`);
  };

  useEffect(() => {
    fetchLineupMatches();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'all') return true;
    if (activeTab === 'scheduled') return match.status === 'scheduled';
    if (activeTab === 'ready') return match.status === 'team_selecting';
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button 
          style={{ ...styles.btnBase, ...styles.btnOutline }} 
          onClick={() => navigate("/my-matches")}
        >
          <IconBack /> Back to Scheduled
        </button>
        <span style={styles.title}>
          Lineup Management
          <span style={styles.badge}>{matches.length}</span>
        </span>
        <button 
          style={{ ...styles.btnBase }} 
          onClick={fetchLineupMatches}
        >
          <IconCalendar /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        <button 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'all' && styles.tabActive)
          }}
          onClick={() => setActiveTab('all')}
        >
          All ({matches.length})
        </button>
        <button 
          style={{
            ...styles.tabBtn, 
            ...(activeTab === 'scheduled' && styles.tabActive)
          }}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled ({matches.filter(m => m.status === 'scheduled').length})
        </button>
        <button 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'ready' && styles.tabActive)
          }}
          onClick={() => setActiveTab('ready')}
        >
          Ready ({matches.filter(m => m.status === 'team_selecting').length})
        </button>
      </div>

{loading ? (
        <div style={styles.emptyBox}>
          <div style={{ fontSize: '16px', marginBottom: '12px' }}>⏳ Loading your lineup matches...</div>
        </div>
      ) : error ? (
        <div style={styles.emptyBox}>
          <div style={{ color: '#ef4444', fontSize: '15px', marginBottom: '8px' }}>⚠️ {error}</div>
          <button 
            style={{ ...styles.btnBase, ...styles.btnLineup, margin: '0 auto', padding: '12px 24px' }}
            onClick={fetchLineupMatches}
          >
            🔄 Retry
          </button>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: "15px", marginBottom: "8px" }}>
            No matches ready for lineup
          </p>
          <button
            style={{ ...styles.btnBase, ...styles.btnLineup, margin: "0 auto", padding: "12px 24px" }}
            onClick={() => navigate("/my-matches")}
          >
            <IconCalendar /> Go to Scheduled Matches
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredMatches.map((match) => (
            <div key={match._id} style={styles.card}>
              <div>
                <div style={styles.teams}>
                  {match.team1?.shortName || match.team1?.name || "T1"}
                  <span style={styles.vs}>vs</span>
                  {match.team2?.shortName || match.team2?.name || "T2"}
                </div>
                <span style={styles.badgeStatus(match.status)}>
                  {match.status === 'scheduled' ? 'SCHEDULED' : 
                   match.status === 'team_selecting' ? 'LINEUP READY' : match.status?.toUpperCase()}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={styles.metaRow}>
                  <IconCalendar style={{width: 14, height: 14}} />
                  {formatDateTime(match.scheduledDate)}
                </div>
                <div style={styles.metaRow}>
                  {match.venue?.name || "TBD"}
                  {match.venue?.city && `, ${match.venue.city}`}
                </div>
                <div style={styles.formatPill}>
                  {match.format?.toUpperCase()} · {match.overs} overs ·{" "}
                  {match.tournament?.name || "Practice Match"}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={{ ...styles.btnBase, ...styles.btnLineup }}
                  onClick={() => handleSetLineups(match)}
                >
                  <IconLineup /> Set Lineups
                </button>
                <button
                  style={{ ...styles.btnBase, ...styles.btnLive }}
                  onClick={() => handleLiveControl(match)}
                >
                  <IconLive /> Live Control
                </button>
                <button
                  style={{ ...styles.btnBase, ...styles.btnOutline }}
                  onClick={() => navigate(`/match/${match._id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LineupPage;

