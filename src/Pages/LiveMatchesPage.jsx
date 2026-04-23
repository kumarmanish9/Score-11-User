import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../Services/matchService";
import { getCurrentUser } from "../Services/AuthServices";

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
    fontSize: "24px",
    fontWeight: 600,
    flex: 1,
    color: "#dc2626",
  },
  liveBadge: {
    background: "#dc2626",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    animation: "pulse 2s infinite",
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
    transition: "all 0.15s",
    textDecoration: "none",
  },
  btnLiveControl: {
    background: "#dc2626",
    borderColor: "#dc2626",
    color: "#fff",
  },
  btnDetails: {
    background: "transparent",
    borderColor: "rgba(0,0,0,0.2)",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    border: "2px solid #dc2626",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 8px 32px rgba(220,38,38,0.1)",
  },
  liveIndicator: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#dc2626",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
    animation: "pulse 1.5s infinite",
  },
  teams: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  vs: {
    fontSize: "14px",
    color: "#dc2626",
    fontWeight: 700,
    margin: "0 8px",
  },
  statusLive: {
    color: "#dc2626",
    fontWeight: 600,
    fontSize: "14px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#666",
    marginBottom: "4px",
  },
  scorePreview: {
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "12px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "6rem 2rem",
    color: "#888",
  },
};

const IconLive = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="8" cy="8" r="2" fill="currentColor"/>
  </svg>
);

const IconControl = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 4h12v8H2V4zm0 2v4h12V6H2z"/>
  </svg>
);

const IconDetails = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8.5 2L6 6h3l-1.5 4h3l-1.5-4h3L8.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function LiveMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchLiveMatches = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getMatches('live', { page: pageNum, limit: 12 });
      setMatches(Array.isArray(data.matches) ? data.matches : []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching live matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches(page);
    getCurrentUser().then(setCurrentUser).catch(() => {});
  }, [page]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "LIVE";
    return new Date(dateStr).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwner = (match) => {
    if (!currentUser || !match.createdBy) return false;
    return match.createdBy.toString() === currentUser._id;
  };

  const handleControl = (matchId) => {
    navigate(`/match/${matchId}/live-control`);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyBox}>
          <div>Loading live matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={{ ...styles.btnBase, marginRight: 'auto' }} onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <span style={styles.title}>
          🔴 Live Matches <span style={styles.liveBadge}>{matches.length}</span>
        </span>
      </div>

      {matches.length === 0 ? (
        <div style={styles.emptyBox}>
          <IconLive style={{ fontSize: "48px", opacity: 0.5, marginBottom: "1rem" }} />
          <p style={{ fontSize: "18px", marginBottom: "8px" }}>No Live Matches</p>
          <p style={{ fontSize: "14px" }}>All scheduled matches will appear here when they start.</p>
          <button style={{ ...styles.btnBase, ...styles.btnLiveControl, marginTop: "1rem", padding: "12px 24px" }} onClick={() => navigate("/scheduled")}>
            Create & Start Match
          </button>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {matches.map((match) => (
              <div key={match._id} style={styles.card}>
                <div style={styles.liveIndicator}>
                  LIVE ●
                </div>
                <div style={styles.teams}>
                  {match.team1?.name || "Team1"} vs {match.team2?.name || "Team2"}
                </div>
                <div style={styles.statusLive}>
                  <IconLive style={{ width: "14px", height: "14px", marginRight: "4px" }} />
                  Live - {formatDateTime(match.actualStartTime || match.scheduledDate)}
                </div>
                {match.score && (
                  <div style={styles.scorePreview}>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      Team1: {match.score.team1?.runs || 0}/{match.score.team1?.wickets || 0} ({match.score.team1?.overs || '0.0'})
                    </div>
                    {match.score.team2 && (
                      <div style={{ fontSize: "14px", fontWeight: 500, mt: "4px" }}>
                        Team2: {match.score.team2.runs || 0}/{match.score.team2.wickets || 0} ({match.score.team2.overs || '0.0'})
                      </div>
                    )}
                  </div>
                )}
                <div style={styles.metaRow}>
                  {match.tournament?.name && (
                    <>🏆 {match.tournament.name}</>
                  )}
                </div>
                <div style={styles.actions}>
                  {isOwner(match) && (
                    <button style={{ ...styles.btnBase, ...styles.btnLiveControl }} onClick={() => handleControl(match._id)}>
                      <IconControl /> Control Live
                    </button>
                  )}
                  <button style={{ ...styles.btnBase, ...styles.btnDetails }} onClick={() => navigate(`/match/${match._id}`)}>
                    <IconDetails /> Match Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={styles.btnBase}>← Prev</button>
              <span style={{ margin: "0 1rem", fontWeight: 500 }}>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={styles.btnBase}>Next →</button>
            </div>
          )}
        </>
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default LiveMatchesPage;

