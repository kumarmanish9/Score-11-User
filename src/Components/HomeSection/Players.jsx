import React from "react";
import { getPlayers } from "../../Services/playerService";
import PlayerCard from "../Cards/PlayerCard";

function Players({ players = [] }) {
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (players.length) {
      setTopPlayers(players.slice(0, 8));
      setLoading(false);
    } else {
      fetchPlayers();
    }
  }, [players]);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      console.log("Players API:", data);

      // adjust if API returns { data: [] }
      const playersData = data.data || data;

      setTopPlayers(playersData.slice(0, 8));
    } catch (err) {
      console.error("Players fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinArc {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .ps-section {
          background: #f8f9fc;
          padding: 72px 0 88px;
          font-family: 'Sora', sans-serif;
        }
        .ps-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Header ── */
        .ps-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
        }
        .ps-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          border-radius: 8px;
          padding: 4px 12px;
          border: 1px solid #dbeafe;
        }
        .ps-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2563eb;
        }
        .ps-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.8px;
          margin: 0;
          text-align: center;
          line-height: 1.15;
        }
        .ps-title span {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-subtitle {
          font-size: 14.5px;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }

        /* ── Loader ── */
        .ps-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 16px;
        }
        .ps-spinner {
          width: 42px; height: 42px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spinArc 0.75s linear infinite;
        }
        .ps-loader-text {
          color: #94a3b8;
          font-size: 13.5px;
          font-weight: 500;
        }

        /* ── Grid ── */
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        /* ── Each card wrapper with stagger ── */
        .ps-card-wrap {
          animation: fadeSlideUp 0.4s ease both;
        }
        .ps-card-wrap:nth-child(1)  { animation-delay: 0.04s; }
        .ps-card-wrap:nth-child(2)  { animation-delay: 0.08s; }
        .ps-card-wrap:nth-child(3)  { animation-delay: 0.12s; }
        .ps-card-wrap:nth-child(4)  { animation-delay: 0.16s; }
        .ps-card-wrap:nth-child(5)  { animation-delay: 0.20s; }
        .ps-card-wrap:nth-child(6)  { animation-delay: 0.24s; }
        .ps-card-wrap:nth-child(7)  { animation-delay: 0.28s; }
        .ps-card-wrap:nth-child(8)  { animation-delay: 0.32s; }

        /* ── Rank badge injected around PlayerCard ── */
        .ps-card-inner {
          position: relative;
        }
        .ps-rank {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 26px; height: 26px;
          border-radius: 8px;
          background: #0f172a;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          letter-spacing: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }
        .ps-rank.gold   { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .ps-rank.silver { background: linear-gradient(135deg, #94a3b8, #64748b); }
        .ps-rank.bronze { background: linear-gradient(135deg, #b45309, #92400e); }

        /* ── View all button ── */
        .ps-footer {
          text-align: center;
          margin-top: 52px;
        }
        .ps-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 34px;
          background: #0f172a;
          color: #ffffff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.15s;
        }
        .ps-view-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
          color: #fff;
          text-decoration: none;
        }
        .ps-view-btn:active { transform: translateY(0); }

        /* ── Divider line under header ── */
        .ps-header-line {
          width: 48px; height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
          margin-top: 4px;
        }

        /* ── Empty state ── */
        .ps-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 0;
          gap: 12px;
        }
        .ps-empty-icon { font-size: 48px; opacity: 0.2; }
        .ps-empty-text { color: #94a3b8; font-weight: 600; font-size: 14px; }
      `}</style>

      <section className="ps-section">
        <div className="ps-container">

          {/* HEADER */}
          <div className="ps-header">
            <span className="ps-eyebrow">
              <span className="ps-eyebrow-dot" />
              This Season
            </span>
            <h2 className="ps-title">
              Top <span>Players</span>
            </h2>
            <p className="ps-subtitle">Best performers this season</p>
            <div className="ps-header-line" />
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="ps-loader">
              <div className="ps-spinner" />
              <span className="ps-loader-text">Loading players…</span>
            </div>
          ) : topPlayers.length === 0 ? (
            <div className="ps-empty">
              <span className="ps-empty-icon">🏏</span>
              <p className="ps-empty-text">No players found</p>
            </div>
          ) : (
            <>
              {/* GRID */}
              <div className="ps-grid">
                {topPlayers.map((player, index) => (
                  <div className="ps-card-wrap" key={player._id || index}>
                    <div className="ps-card-inner">
                      <span
                        className={`ps-rank ${
                          index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <PlayerCard {...player} rank={index + 1} />
                    </div>
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <div className="ps-footer">
                <a href="/players" className="ps-view-btn">
                  View All Players
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
}

export default Players;