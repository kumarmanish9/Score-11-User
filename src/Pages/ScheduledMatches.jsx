import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyMatches, startMatch } from "../Services/matchService";


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
    background: "#185FA5",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 500,
    borderRadius: "99px",
    padding: "2px 8px",
    marginLeft: "8px",
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
  btnPrimary: {
    background: "#185FA5",
    borderColor: "#185FA5",
    color: "#fff",
  },
  btnSuccess: {
    background: "#3B6D11",
    borderColor: "#3B6D11",
    color: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  btnOutline: {
    background: "transparent",
    border: "0.5px solid rgba(0,0,0,0.2)",
    color: "#555",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
  badgeStatus: {
    display: "inline-block",
    background: "#FAC775",
    color: "#633806",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 500,
    marginTop: "5px",
  },
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
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <polygon points="4,2 14,8 4,14" fill="currentColor"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.49-2.01-4.5-4.5-4.5Z" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="8" cy="6" r="1.5" fill="currentColor"/>
  </svg>
);

function ScheduledMatches() {
const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled'); // 'scheduled', 'lineup'
  const navigate = useNavigate();

const fetchMyMatches = async (tab = 'scheduled') => {
    try {
      setLoading(true);
      // 🔥 PRIVATE: Fetch user's matches based on tab
      const statusFilter = tab === 'lineup' ? ['team_selecting'] : ['scheduled'];
      const data = await getMyMatches({ status: statusFilter });
      let scheduled = (data || [])
        .filter(match => {
          if (!match || !match._id || typeof match._id !== 'string' || match._id.length !== 24) {
            console.warn('⚠️ Filtering invalid match:', match?._id);
            return false;
          }
          return true;
        })
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      setMatches(scheduled);
      if ((data?.length ?? 0) !== scheduled.length) {
        console.warn(`⚠️ Filtered ${(data?.length ?? 0) - scheduled.length} invalid matches`);
      }
    } catch (error) {
      console.error("Error fetching my matches:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };



  const handleStartMatch = async (match) => {
    if (
      !confirm(
        `Start "${match.team1?.name || "Team1"} vs ${match.team2?.name || "Team2"}"?\n\nThis will begin the toss phase.`
      )
    )
      return;
    try {
      await startMatch(match._id);
      alert("✅ Match started successfully! Redirecting to toss screen.");
      navigate(`/match/${match._id}/toss`);
      // Refresh list
      fetchMyMatches();

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      if (error.response?.status === 404) {
        alert(`❌ Match not found/inactive (ID: ${match._id})\n${errorMsg}\n\nThis shouldn't happen with active filter.`);
      } else if (error.response?.status === 403) {
        alert('🚫 Permission denied. Requires Admin/Umpire role.');
      } else if (error.response?.status === 400) {
        alert(`⚠️ Cannot start: ${errorMsg}`);
      } else {
        alert(`❌ Start failed: ${errorMsg}`);
      }
      console.error('Start match error details:', error.response?.data);
    }
  };

  useEffect(() => {
    fetchMyMatches(activeTab);
  }, [activeTab]);


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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={{ ...styles.btnBase, ...styles.btnOutline }} onClick={() => navigate("/dashboard")}>
          <IconBack /> Back
        </button>
        <span style={styles.title}>
          My Matches 
          <span style={styles.badge}>{matches.length}</span>
        </span>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginLeft: 'auto',
          marginBottom: '1rem'
        }}>
          <button style={{
            ...styles.btnBase,
            ...(activeTab === 'scheduled' && styles.btnSuccess)
          }} onClick={() => setActiveTab('scheduled')}>
            Scheduled
          </button>
          <button style={{
            ...styles.btnBase,
            background: '#3B82F6',
            borderColor: '#3B82F6',
            color: 'white',
            ...(activeTab === 'lineup' && styles.btnSuccess)
          }} onClick={() => setActiveTab('lineup')}>
            Lineup Ready
          </button>
        </div>

        <button style={{ ...styles.btnBase, ...styles.btnPrimary }} onClick={() => navigate("/create-match")}>
          <IconCalendar /> Create match
        </button>
      </div>

      {loading ? (
        <div style={styles.emptyBox}>Loading active scheduled matches...</div>
      ) : matches.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: "15px", marginBottom: "8px" }}>No active scheduled matches</p>
          <p style={{ fontSize: "13px", marginBottom: "1.5rem" }}>
            Create your first match to get started with live scoring!
          </p>
          <button
            style={{ ...styles.btnBase, ...styles.btnPrimary, margin: "0 auto", padding: "12px 24px" }}
            onClick={() => navigate("/create-match")}
          >
            <IconCalendar /> Create Match
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {matches.map((match) => (
            <div key={match._id} style={styles.card}>
              <div>
                <div style={styles.teams}>
                  {match.team1?.shortName || match.team1?.name || "T1"}
                  <span style={styles.vs}>vs</span>
                  {match.team2?.shortName || match.team2?.name || "T2"}
                </div>
                <span style={styles.badgeStatus}>SCHEDULED</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={styles.metaRow}>
                  <IconClock /> {formatDateTime(match.scheduledDate)}
                </div>
                <div style={styles.metaRow}>
                  <IconPin /> {match.venue?.name || "TBD"}{match.venue?.city ? `, ${match.venue.city}` : ""}
                </div>
                <div style={styles.formatPill}>
                  {match.format?.toUpperCase()} · {match.overs} overs · {match.tournament?.name || "Practice Match"}
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={{ 
                    ...styles.btnBase, 
                    ...styles.btnSuccess
                  }}
                  onClick={() => {
                    if (activeTab === 'lineup') {
                      navigate(`/match/${match._id}/lineup`);
                    } else {
                      handleStartMatch(match);
                    }
                  }}
                >
                  {activeTab === 'lineup' ? (
                    <>
                      Set Lineups
                    </>
                  ) : (
                    <>
                      <IconPlay /> Start Match
                    </>
                  )}
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

export default ScheduledMatches;

