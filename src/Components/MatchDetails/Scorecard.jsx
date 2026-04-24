import React from "react";

// ─── Inline styles (white theme, no external CSS needed) ───────────────────

const styles = {
  "@import": `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`,

  container: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
    padding: "32px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  card: {
    width: "100%",
    maxWidth: "680px",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },

  header: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    padding: "28px 32px",
    position: "relative",
    overflow: "hidden",
  },

  headerGlow: {
    position: "absolute",
    top: "-40px",
    right: "-40px",
    width: "180px",
    height: "180px",
    background: "radial-gradient(circle, rgba(229,160,13,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  headerTeamName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    letterSpacing: "-0.3px",
  },

  headerScore: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "42px",
    fontWeight: 700,
    color: "#f5c842",
    margin: "6px 0 2px",
    letterSpacing: "-1px",
    lineHeight: 1,
  },

  headerOvers: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    fontWeight: 400,
    letterSpacing: "0.5px",
  },

  statsRow: {
    display: "flex",
    gap: "0",
    borderBottom: "1px solid #f0f0f0",
  },

  statCell: {
    flex: 1,
    padding: "16px 20px",
    borderRight: "1px solid #f0f0f0",
    textAlign: "center",
  },

  statCellLast: {
    flex: 1,
    padding: "16px 20px",
    textAlign: "center",
  },

  statLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#aaa",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "4px",
  },

  statValue: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111",
  },

  section: {
    padding: "0 0 4px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 28px 12px",
  },

  sectionDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  sectionTitle: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#333",
    margin: 0,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  thead: {
    background: "#fafafa",
  },

  th: {
    padding: "9px 12px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#999",
    textAlign: "center",
    borderBottom: "1px solid #f0f0f0",
  },

  thLeft: {
    padding: "9px 28px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#999",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
  },

  tdName: {
    padding: "13px 28px",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "#111",
    textAlign: "left",
    borderBottom: "1px solid #f7f7f7",
  },

  td: {
    padding: "13px 12px",
    fontSize: "13.5px",
    fontWeight: 400,
    color: "#444",
    textAlign: "center",
    borderBottom: "1px solid #f7f7f7",
  },

  tdHighlight: {
    padding: "13px 12px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#111",
    textAlign: "center",
    borderBottom: "1px solid #f7f7f7",
  },

  tdWicket: {
    padding: "13px 12px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#d93025",
    textAlign: "center",
    borderBottom: "1px solid #f7f7f7",
  },

  trHover: {
    transition: "background 0.15s",
  },

  divider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "0 0 0 0",
  },

  extrasBox: {
    margin: "0 28px 4px",
    background: "#f8f9ff",
    border: "1px solid #e8eaf6",
    borderRadius: "10px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  extrasLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#5c6bc0",
  },

  extrasValue: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#333",
  },

  extrasPill: {
    background: "#e8eaf6",
    borderRadius: "6px",
    padding: "2px 8px",
    fontSize: "12px",
    color: "#3949ab",
    fontWeight: 500,
  },

  noData: {
    padding: "16px 28px",
    fontSize: "13px",
    color: "#bbb",
    fontStyle: "italic",
  },

  stateMsg: {
    textAlign: "center",
    padding: "40px 20px",
    fontSize: "15px",
    color: "#999",
    fontFamily: "'DM Sans', sans-serif",
  },
};

// ─── Helper: row hover effect via inline ───────────────────────────────────
function TRow({ children }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <tr
      style={{ background: hovered ? "#fafbff" : "transparent", transition: "background 0.15s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </tr>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function Scorecard({ scorecard, loading, teamMap = {} }) {

  // ✅ Inject Google Fonts once
  React.useEffect(() => {
    const id = "scorecard-gfonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  if (loading) {
    return <p style={styles.stateMsg}>Loading scorecard…</p>;
  }

  if (!scorecard) {
    return <p style={styles.stateMsg}>No scorecard available</p>;
  }

  const runs     = scorecard?.runs     ?? 0;
  const wickets  = scorecard?.wickets  ?? 0;
  const overs    = scorecard?.overs    ?? "0.0";
  const runRate  = scorecard?.runRate  ?? "0.00";
  const extras   = scorecard?.extras   ?? {};
  const teamName = teamMap?.[scorecard?.battingTeam] || "Batting Team";

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* ── HEADER ── */}
        <div style={styles.header}>
          <div style={styles.headerGlow} />
          <p style={styles.headerTeamName}>{teamName}</p>
          <p style={styles.headerScore}>
            {runs}<span style={{ opacity: 0.5, fontWeight: 400 }}>/{wickets}</span>
          </p>
          <p style={styles.headerOvers}>{overs} overs</p>
        </div>

        {/* ── STATS ROW ── */}
        <div style={styles.statsRow}>
          <div style={styles.statCell}>
            <div style={styles.statLabel}>Run Rate</div>
            <div style={styles.statValue}>{runRate}</div>
          </div>
          <div style={styles.statCell}>
            <div style={styles.statLabel}>Extras</div>
            <div style={styles.statValue}>{extras?.total ?? 0}</div>
          </div>
          <div style={styles.statCellLast}>
            <div style={styles.statLabel}>Wickets</div>
            <div style={{ ...styles.statValue, color: wickets >= 8 ? "#d93025" : "#111" }}>
              {wickets}
            </div>
          </div>
        </div>

        {/* ── EXTRAS DETAIL ── */}
        <div style={{ padding: "16px 28px 4px" }}>
          <div style={styles.extrasBox}>
            <span style={styles.extrasLabel}>Extras</span>
            <span style={styles.extrasValue}>{extras?.total ?? 0}</span>
            {[
              { label: "Wd", val: extras?.wides   ?? 0 },
              { label: "Nb", val: extras?.noBalls  ?? 0 },
              { label: "B",  val: extras?.byes     ?? 0 },
              { label: "Lb", val: extras?.legByes  ?? 0 },
            ].map(({ label, val }) => (
              <span key={label} style={styles.extrasPill}>
                {label}: {val}
              </span>
            ))}
          </div>
        </div>

        {/* ── BATTING ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={{ ...styles.sectionDot, background: "#22c55e" }} />
            <h5 style={styles.sectionTitle}>Batting</h5>
          </div>

          {!(scorecard?.battingScorecard?.length > 0) ? (
            <p style={styles.noData}>No batting data yet</p>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.thLeft}>Batter</th>
                  <th style={styles.th}>R</th>
                  <th style={styles.th}>B</th>
                  <th style={styles.th}>4s</th>
                  <th style={styles.th}>6s</th>
                  <th style={styles.th}>SR</th>
                </tr>
              </thead>
              <tbody>
                {scorecard.battingScorecard.map((b, i) => (
                  <TRow key={i}>
                    <td style={styles.tdName}>{b?.playerName ?? "—"}</td>
                    <td style={styles.tdHighlight}>{b?.runs ?? 0}</td>
                    <td style={styles.td}>{b?.balls ?? 0}</td>
                    <td style={styles.td}>{b?.fours ?? 0}</td>
                    <td style={styles.td}>{b?.sixes ?? 0}</td>
                    <td style={styles.td}>{b?.strikeRate ?? "0.00"}</td>
                  </TRow>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.divider} />

        {/* ── BOWLING ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={{ ...styles.sectionDot, background: "#3b82f6" }} />
            <h5 style={styles.sectionTitle}>Bowling</h5>
          </div>

          {!(scorecard?.bowlingScorecard?.length > 0) ? (
            <p style={styles.noData}>No bowling data yet</p>
          ) : (
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.thLeft}>Bowler</th>
                  <th style={styles.th}>O</th>
                  <th style={styles.th}>R</th>
                  <th style={styles.th}>W</th>
                  <th style={styles.th}>Econ</th>
                </tr>
              </thead>
              <tbody>
                {scorecard.bowlingScorecard.map((b, i) => (
                  <TRow key={i}>
                    <td style={styles.tdName}>{b?.playerName ?? "—"}</td>
                    <td style={styles.td}>{b?.overs ?? "0.0"}</td>
                    <td style={styles.td}>{b?.runs ?? 0}</td>
                    <td style={styles.tdWicket}>{b?.wickets ?? 0}</td>
                    <td style={styles.td}>{b?.economy ?? "0.00"}</td>
                  </TRow>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── FOOTER PAD ── */}
        <div style={{ height: "20px" }} />
      </div>
    </div>
  );
}

export default Scorecard;