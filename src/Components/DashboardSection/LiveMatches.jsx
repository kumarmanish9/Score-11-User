import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLiveMatches } from "../../Services/dashboardService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --white: #ffffff;
    --off-white: #f8f8f6;
    --smoke: #f0eeeb;
    --line: #e8e5e0;
    --muted: #b0aa9f;
    --ink: #1a1814;
    --ink-light: #4a453e;
    --live-red: #e8321a;
    --live-glow: rgba(232, 50, 26, 0.12);
    --accent: #ff5c3a;
  }

  .lm-section {
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    padding: 0;
  }

  /* ── Header ── */
  .lm-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 0 28px 0;
    border-bottom: 1.5px solid var(--line);
    margin-bottom: 28px;
  }

  .lm-title-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lm-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.06em;
    color: var(--ink);
    margin: 0;
    line-height: 1;
  }

  .lm-pulse-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--live-red);
    animation: lm-pulse 1.6s ease-in-out infinite;
    flex-shrink: 0;
    margin-bottom: 2px;
  }

  @keyframes lm-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232, 50, 26, 0.5); opacity: 1; }
    50% { box-shadow: 0 0 0 8px rgba(232, 50, 26, 0); opacity: 0.8; }
  }

  .lm-view-all {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    padding-bottom: 1px;
  }

  .lm-view-all:hover {
    color: var(--ink);
    border-color: var(--ink);
  }

  /* ── Loading ── */
  .lm-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 32px 0;
    color: var(--muted);
    font-size: 0.88rem;
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  .lm-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--line);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: lm-spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes lm-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Empty ── */
  .lm-empty {
    padding: 40px 0;
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
    letter-spacing: 0.02em;
  }

  /* ── Match List ── */
  .lm-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Match Card ── */
  .lm-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid var(--line);
    transition: background 0.15s;
    animation: lm-fade-in 0.4s ease both;
  }

  .lm-card:last-child {
    border-bottom: none;
  }

  .lm-card:hover {
    background: var(--off-white);
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 4px;
  }

  @keyframes lm-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* stagger */
  .lm-card:nth-child(1) { animation-delay: 0.05s; }
  .lm-card:nth-child(2) { animation-delay: 0.10s; }
  .lm-card:nth-child(3) { animation-delay: 0.15s; }
  .lm-card:nth-child(4) { animation-delay: 0.20s; }
  .lm-card:nth-child(5) { animation-delay: 0.25s; }

  /* LIVE badge column */
  .lm-badge-col {
    display: flex;
    align-items: center;
  }

  .lm-badge {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    color: var(--live-red);
    background: var(--live-glow);
    border: 1px solid rgba(232, 50, 26, 0.2);
    border-radius: 3px;
    padding: 3px 7px 2px;
    line-height: 1;
    white-space: nowrap;
  }

  /* Teams column */
  .lm-teams {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .lm-team {
    font-size: 0.98rem;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }

  .lm-vs {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  /* Score column */
  .lm-score-col {
    text-align: right;
    flex-shrink: 0;
  }

  .lm-score {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem;
    letter-spacing: 0.06em;
    color: var(--ink);
    white-space: nowrap;
  }

  .lm-score-empty {
    font-size: 0.75rem;
    color: var(--muted);
    letter-spacing: 0.06em;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .lm-card {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      gap: 10px 12px;
    }

    .lm-score-col {
      grid-column: 2;
      grid-row: 2;
      text-align: left;
    }

    .lm-team {
      font-size: 0.9rem;
    }
  }
`;

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getLiveMatches();
        if (!mounted) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching live matches:", err);
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <section className="lm-section">

        {/* Header */}
        <div className="lm-header">
          <div className="lm-title-wrap">
            <span className="lm-pulse-dot" />
            <h2 className="lm-title">Live Matches</h2>
          </div>
          <Link to="/matches?tab=live" className="lm-view-all">
            View All →
          </Link>
        </div>

        {/* Body */}
        {loading ? (
          <div className="lm-loading">
            <span className="lm-spinner" />
            Loading live matches…
          </div>
        ) : (
          <div className="lm-list">
            {matches.length ? (
              matches.map((match, index) => {
                const t1 =
                  match.team1?.shortName ||
                  match.team1?.name ||
                  match.team1 ||
                  (match.teams && match.teams[0]) ||
                  "Team 1";
                const t2 =
                  match.team2?.shortName ||
                  match.team2?.name ||
                  match.team2 ||
                  (match.teams && match.teams[1]) ||
                  "Team 2";
                const score =
                  match.score || match.liveScore || match.summary || "";

                return (
                  <div className="lm-card" key={match._id || index}>
                    {/* Live badge */}
                    <div className="lm-badge-col">
                      <span className="lm-badge">Live</span>
                    </div>

                    {/* Teams */}
                    <div className="lm-teams">
                      <span className="lm-team">{t1}</span>
                      <span className="lm-vs">vs</span>
                      <span className="lm-team">{t2}</span>
                    </div>

                    {/* Score */}
                    <div className="lm-score-col">
                      {score ? (
                        <span className="lm-score">{score}</span>
                      ) : (
                        <span className="lm-score-empty">— —</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="lm-empty">No live matches right now.</div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default LiveMatches;