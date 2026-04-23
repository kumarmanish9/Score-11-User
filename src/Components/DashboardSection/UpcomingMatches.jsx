import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUpcomingMatches } from "../../Services/dashboardService";

function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingMatches();
        if (!mounted) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching upcoming matches:", err);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinArc { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .um-section {
          background: #f8f9fc;
          padding: 64px 0 80px;
          font-family: 'Sora', sans-serif;
        }
        .um-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Header ── */
        .um-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          animation: fadeSlideUp 0.35s ease both;
          gap: 12px;
          flex-wrap: wrap;
        }
        .um-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .um-accent-bar {
          width: 5px; height: 30px;
          border-radius: 3px;
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
          flex-shrink: 0;
        }
        .um-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin: 0;
        }
        .um-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fffbeb;
          color: #d97706;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          border-radius: 7px;
          padding: 3px 10px;
          border: 1px solid #fde68a;
        }
        .um-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #f59e0b;
        }
        .um-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
          padding: 7px 16px;
          border-radius: 9px;
          border: 1.5px solid #bfdbfe;
          background: #eff6ff;
          transition: background 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .um-view-all:hover {
          background: #dbeafe;
          transform: translateY(-1px);
          text-decoration: none;
          color: #1d4ed8;
        }

        /* ── Loader ── */
        .um-loader {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .um-skeleton {
          height: 88px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
        }

        /* ── List ── */
        .um-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Card ── */
        .um-card {
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          animation: fadeSlideUp 0.38s ease both;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .um-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
          border-radius: 0 2px 2px 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .um-card:hover {
          transform: translateX(3px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.07);
          border-color: #fde68a;
        }
        .um-card:hover::before { opacity: 1; }

        /* stagger */
        .um-card:nth-child(1) { animation-delay: 0.04s; }
        .um-card:nth-child(2) { animation-delay: 0.09s; }
        .um-card:nth-child(3) { animation-delay: 0.14s; }
        .um-card:nth-child(4) { animation-delay: 0.19s; }
        .um-card:nth-child(5) { animation-delay: 0.24s; }

        /* teams row */
        .um-teams {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .um-team-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .um-team-avatar {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
          border: 1.5px solid #e8edf5;
        }
        .um-team-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .um-vs {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: #64748b;
          flex-shrink: 0;
        }

        /* date + time */
        .um-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }
        .um-date {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          background: #f8f9fc;
          border: 1px solid #e8edf5;
          border-radius: 7px;
          padding: 3px 9px;
          white-space: nowrap;
        }
        .um-time {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: #f59e0b;
          white-space: nowrap;
        }

        /* empty */
        .um-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 56px 0;
          gap: 10px;
        }
        .um-empty-icon { font-size: 44px; opacity: 0.2; }
        .um-empty-text { color: #94a3b8; font-weight: 600; font-size: 14px; }

        @media (max-width: 560px) {
          .um-team-name { max-width: 70px; }
          .um-meta { display: none; }
        }
      `}</style>

      <section className="um-section">
        <div className="um-container">

          {/* HEADER */}
          <div className="um-header">
            <div className="um-header-left">
              <div className="um-accent-bar" />
              <h2 className="um-title">Upcoming Matches</h2>
              <span className="um-badge">
                <span className="um-badge-dot" />
                Scheduled
              </span>
            </div>
            <Link to="/matches?tab=upcoming" className="um-view-all">
              View All
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* LOADING — skeleton shimmer */}
          {loading ? (
            <div className="um-loader">
              {[1, 2, 3].map(i => (
                <div className="um-skeleton" key={i} style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="um-empty">
              <span className="um-empty-icon">🗓️</span>
              <p className="um-empty-text">No upcoming matches scheduled</p>
            </div>
          ) : (
            <div className="um-list">
              {matches.map((match, index) => {
                const t1 = match.team1?.shortName || match.team1?.name || match.team1 || (match.teams && match.teams[0]) || "Team 1";
                const t2 = match.team2?.shortName || match.team2?.name || match.team2 || (match.teams && match.teams[1]) || "Team 2";
                const date = match.date || match.startDate || match.start || match.kickoff || "";
                const time = match.time || match.startTime || match.kickoffTime || "";

                const initials = (name) =>
                  String(name).split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div className="um-card" key={match._id || index}>

                    {/* TEAMS */}
                    <div className="um-teams">
                      {/* Team 1 */}
                      <div className="um-team-pill">
                        <div
                          className="um-team-avatar"
                          style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", color: "#2563eb" }}
                        >
                          {initials(t1)}
                        </div>
                        <span className="um-team-name">{t1}</span>
                      </div>

                      {/* VS */}
                      <div className="um-vs">VS</div>

                      {/* Team 2 */}
                      <div className="um-team-pill" style={{ justifyContent: "flex-end" }}>
                        <span className="um-team-name" style={{ textAlign: "right" }}>{t2}</span>
                        <div
                          className="um-team-avatar"
                          style={{ background: "linear-gradient(135deg,#fce7f3,#ede9fe)", color: "#7c3aed" }}
                        >
                          {initials(t2)}
                        </div>
                      </div>
                    </div>

                    {/* DATE + TIME */}
                    <div className="um-meta">
                      {date && (
                        <span className="um-date">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18"/>
                          </svg>
                          {date}
                        </span>
                      )}
                      {time && (
                        <span className="um-time">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                          {time}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default UpcomingMatches;