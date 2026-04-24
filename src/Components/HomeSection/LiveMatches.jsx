import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../Cards/MatchCard";
import { getLiveMatches, getUpcomingMatches } from "../../Services/dashboardService";
import { getMatches } from "../../Services/matchService";
import { getPublicTeam } from "../../Services/teamService";

/* ─── Inline styles (no external CSS needed) ─── */
const styles = {
  section: {
    background: "#f8f9fc",
    minHeight: "100vh",
    padding: "60px 0 80px",
    fontFamily: "'Sora', 'Nunito', sans-serif",
  },
  container: {
    maxWidth: 1160,
    margin: "0 auto",
    padding: "0 24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 36,
  },
  headerAccent: {
    width: 6,
    height: 36,
    borderRadius: 4,
    background: "linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)",
    flexShrink: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.5px",
    margin: 0,
  },

  /* Tabs */
  tabsRow: {
    display: "flex",
    gap: 8,
    marginBottom: 36,
    background: "#ffffff",
    padding: 6,
    borderRadius: 14,
    border: "1.5px solid #e8edf5",
    width: "fit-content",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },

  /* Loading */
  loaderWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loaderText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
  },

  /* Empty state */
  empty: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 0",
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.25,
  },
  emptyText: {
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: 15,
  },

  /* Match card (non-live) */
  card: {
    background: "#ffffff",
    border: "1.5px solid #e8edf5",
    borderRadius: 18,
    padding: "28px 24px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  vsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  teamBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 800,
    color: "#2563eb",
    border: "2px solid #fff",
    boxShadow: "0 0 0 1.5px #e8edf5",
  },
  teamName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1e293b",
    textAlign: "center",
    lineHeight: 1.2,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    color: "#64748b",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    background: "#f1f5f9",
    borderRadius: 1,
  },
  resultPill: {
    display: "inline-block",
    background: "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)",
    color: "#15803d",
    fontWeight: 700,
    fontSize: 12.5,
    borderRadius: 8,
    padding: "5px 12px",
    textAlign: "center",
  },
  dateLine: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#94a3b8",
    fontSize: 12.5,
    fontWeight: 500,
  },
  viewBtn: {
    display: "block",
    textAlign: "center",
    padding: "10px 0",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    borderRadius: 10,
    textDecoration: "none",
    letterSpacing: "0.2px",
    marginTop: 4,
    transition: "opacity 0.15s",
  },

  /* View all */
  viewAllWrap: {
    textAlign: "center",
    marginTop: 52,
  },
  viewAllBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 32px",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 12,
    textDecoration: "none",
    letterSpacing: "0.2px",
    transition: "background 0.2s",
  },

  /* Upcoming status badge */
  upcomingBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: 11.5,
    fontWeight: 700,
    borderRadius: 6,
    padding: "3px 10px",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },
};

/* ─── Tab Button ─── */
function TabButton({ label, count, active, onClick, color }) {
  const dotColors = {
    live: "#ef4444",
    upcoming: "#f59e0b",
    completed: "#10b981",
  };
  const activeStyle = {
    background: "#0f172a",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  };
  const inactiveStyle = {
    background: "transparent",
    color: "#64748b",
  };
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 10,
        padding: "8px 18px",
        fontWeight: 700,
        fontSize: 13.5,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.18s ease",
        fontFamily: "inherit",
        ...(active ? activeStyle : inactiveStyle),
      }}
    >
      {color === "live" && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: dotColors[color],
            display: "inline-block",
            boxShadow: active ? "0 0 0 3px rgba(239,68,68,0.25)" : "none",
            animation: active ? "pulse 1.2s infinite" : "none",
          }}
        />
      )}
      {label}{" "}
      <span
        style={{
          background: active ? "rgba(255,255,255,0.18)" : "#f1f5f9",
          color: active ? "#fff" : "#94a3b8",
          borderRadius: 6,
          padding: "1px 7px",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── Non-live Match Card ─── */
function StyledMatchCard({ match, getTeamName, getWinnerName, isUpcoming }) {
  const [hovered, setHovered] = React.useState(false);

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  const t1 = getTeamName(match.team1);
  const t2 = getTeamName(match.team2);
  const winner = getWinnerName(match);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.10)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isUpcoming && (
        <span style={styles.upcomingBadge}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
          Upcoming
        </span>
      )}
      {!isUpcoming && match.result && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "#f0fdf4",
            color: "#16a34a",
            fontSize: 11.5,
            fontWeight: 700,
            borderRadius: 6,
            padding: "3px 10px",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          Completed
        </span>
      )}

      {/* Teams */}
      <div style={styles.vsRow}>
        <div style={styles.teamBox}>
          <div style={styles.teamAvatar}>{initials(t1)}</div>
          <span style={styles.teamName}>{t1}</span>
        </div>
        <div style={styles.vsBadge}>VS</div>
        <div style={styles.teamBox}>
          <div
            style={{
              ...styles.teamAvatar,
              background: "linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)",
              color: "#7c3aed",
            }}
          >
            {initials(t2)}
          </div>
          <span style={styles.teamName}>{t2}</span>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Result */}
      {!isUpcoming && winner && (
        <div style={{ textAlign: "center" }}>
          <span style={styles.resultPill}>
            🏆 {winner}
            {match.result?.margin ? ` won by ${match.result.margin}` : " won"}
          </span>
        </div>
      )}

      {/* Date */}
      {match.scheduledDate && (
        <div style={{ ...styles.dateLine, justifyContent: "center" }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {new Date(match.scheduledDate).toDateString()}
        </div>
      )}

      <Link to={`/match/${match._id}`} style={styles.viewBtn}>
        View Details →
      </Link>
    </div>
  );
}

/* ─── Main Component ─── */
function LiveMatches({ live = [], upcoming = [], refresh }) {
  const [activeTab, setActiveTab] = useState("live");
  const [localLoading, setLocalLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState(live || []);
  const [upcomingMatches, setUpcomingMatches] = useState(upcoming || []);
  const [completedMatches, setCompletedMatches] = useState([]);

  const getTeamName = (team) => {
    if (!team) return "Team";
    if (typeof team === "string") return team;
    return team.shortName || team.name || "Team";
  };

  const getWinnerName = (match) => {
    if (match?.result?.winnerName) return match.result.winnerName;
    const winner = match?.result?.winner;
    if (!winner) return "";
    if (typeof winner === "object") return getTeamName(winner);
    if (winner === match?.team1?._id) return getTeamName(match.team1);
    if (winner === match?.team2?._id) return getTeamName(match.team2);
    return winner;
  };

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setLocalLoading(true);
        const [liveData, upcomingData, completedData] = await Promise.all([
          getLiveMatches().catch(() => []),
          getUpcomingMatches().catch(() => []),
          getMatches("completed").catch(() => []),
        ]);
        if (!mounted) return;
        setLiveMatches(live && live.length ? live : Array.isArray(liveData) ? liveData : []);
        setUpcomingMatches(upcoming && upcoming.length ? upcoming : Array.isArray(upcomingData) ? upcomingData : []);
        let completed = Array.isArray(completedData) ? completedData : [];
        const resolvedMatches = await Promise.all(
          completed.map(async (match) => {
            try {
              let team1 = match.team1;
              let team2 = match.team2;
              if (typeof team1 === "string") {
                const t1 = await getPublicTeam(team1).catch(() => null);
                if (t1) team1 = t1;
              }
              if (typeof team2 === "string") {
                const t2 = await getPublicTeam(team2).catch(() => null);
                if (t2) team2 = t2;
              }
              return { ...match, team1, team2 };
            } catch (err) {
              console.error("Team fetch error:", err);
              return match;
            }
          })
        );
        setCompletedMatches(resolvedMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        if (mounted) {
          setLiveMatches(live || []);
          setUpcomingMatches(upcoming || []);
          setCompletedMatches([]);
        }
      } finally {
        if (mounted) setLocalLoading(false);
      }
    };
    fetchAll();
    return () => (mounted = false);
  }, [live, upcoming, refresh]);

  if (localLoading) {
    return (
      <section style={styles.section}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={styles.container}>
          <div style={styles.loaderWrap}>
            <div style={styles.spinner} />
            <span style={styles.loaderText}>Loading matches…</span>
          </div>
        </div>
      </section>
    );
  }

  const dataForTab =
    activeTab === "live"
      ? liveMatches
      : activeTab === "upcoming"
      ? upcomingMatches
      : completedMatches;

  return (
    <section style={styles.section}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
        }
        .view-all-btn:hover { background: #1e293b !important; }
        .view-btn-inner:hover { opacity: 0.88; }
      `}</style>

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerAccent} />
          <h2 style={styles.title}>Matches</h2>
        </div>

        {/* Tabs */}
        <div style={styles.tabsRow}>
          <TabButton
            label="Live"
            count={liveMatches.length}
            active={activeTab === "live"}
            onClick={() => setActiveTab("live")}
            color="live"
          />
          <TabButton
            label="Upcoming"
            count={upcomingMatches.length}
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
            color="upcoming"
          />
          <TabButton
            label="Completed"
            count={completedMatches.length}
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            color="completed"
          />
        </div>

        {/* Cards */}
        <div style={styles.grid}>
          {dataForTab.length === 0 ? (
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>
                {activeTab === "live" ? "📡" : activeTab === "upcoming" ? "🗓️" : "🏁"}
              </span>
              <p style={styles.emptyText}>No {activeTab} matches right now</p>
            </div>
          ) : (
            dataForTab.map((match, index) =>
              activeTab === "live" ? (
                <div key={match._id || index}>
                  <MatchCard match={match} />
                </div>
              ) : (
                <StyledMatchCard
                  key={match._id || index}
                  match={match}
                  getTeamName={getTeamName}
                  getWinnerName={getWinnerName}
                  isUpcoming={activeTab === "upcoming"}
                />
              )
            )
          )}
        </div>

        {/* View All */}
        <div style={styles.viewAllWrap}>
          <Link to="/matches" className="view-all-btn" style={styles.viewAllBtn}>
            View All Matches
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default LiveMatches;