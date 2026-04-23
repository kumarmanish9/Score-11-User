import React, { useState, useEffect } from "react";
import { getPlayers } from "../../Services/playerService";
import LeaderboardCard from "./LeaderboardCard";

function Leaderboard({ streams = [] }) {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [mvps, setMvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const players = await getPlayers();
      const topBatsmen = players.slice(0, 3).map(p => ({ name: p.name || p.fullName, score: `${p.runs || 0} Runs` }));
      const topBowlers = players.slice(3, 6).map(p => ({ name: p.name || p.fullName, score: `${p.wickets || 0} Wickets` }));
      const topMvps = players.slice(6, 9).map(p => ({ name: p.name || p.fullName, score: `${p.points || 0} Points` }));
      setBatsmen(topBatsmen);
      setBowlers(topBowlers);
      setMvps(topMvps);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
          @keyframes spinArc { to { transform: rotate(360deg); } }
        `}</style>
        <section style={{ background: "#f8f9fc", padding: "80px 0", fontFamily: "'Sora', sans-serif" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44,
              border: "3px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spinArc 0.75s linear infinite"
            }} />
            <span style={{ color: "#94a3b8", fontSize: 13.5, fontWeight: 500 }}>
              Loading leaderboard…
            </span>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinArc { to { transform: rotate(360deg); } }

        .lb-section {
          background: #f8f9fc;
          padding: 72px 0 88px;
          font-family: 'Sora', sans-serif;
        }
        .lb-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Header ── */
        .lb-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 52px;
          animation: fadeSlideUp 0.4s ease both;
        }
        .lb-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fefce8;
          color: #ca8a04;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          border-radius: 8px;
          padding: 4px 12px;
          border: 1px solid #fef08a;
        }
        .lb-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #eab308;
        }
        .lb-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.8px;
          margin: 0;
          text-align: center;
        }
        .lb-title span {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lb-subtitle {
          font-size: 14.5px;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }
        .lb-header-line {
          width: 48px; height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #eab308 0%, #f59e0b 100%);
          margin-top: 2px;
        }

        /* ── Leaderboard cards grid ── */
        .lb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          animation: fadeSlideUp 0.45s ease 0.1s both;
        }

        /* ── Divider ── */
        .lb-divider {
          height: 1px;
          background: #e8edf5;
          margin: 56px 0 48px;
          border-radius: 1px;
        }

        /* ── Streams section ── */
        .lb-streams-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          animation: fadeSlideUp 0.4s ease both;
        }
        .lb-streams-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin: 0;
        }
        .lb-streams-badge {
          background: #fef2f2;
          color: #dc2626;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 7px;
          padding: 3px 10px;
          border: 1px solid #fecaca;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .lb-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ef4444;
          animation: livePulse 1.4s infinite;
        }
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
        }

        .lb-streams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          animation: fadeSlideUp 0.4s ease 0.1s both;
        }

        /* Stream card */
        .lb-stream-card {
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 18px;
          padding: 22px 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .lb-stream-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4444 0%, #f97316 100%);
          border-radius: 18px 18px 0 0;
        }
        .lb-stream-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.09);
        }
        .lb-stream-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .lb-stream-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
        }
        .lb-stream-viewers {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }
        .lb-stream-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          border-radius: 9px;
          text-decoration: none;
          width: fit-content;
          transition: opacity 0.15s, transform 0.15s;
          letter-spacing: 0.2px;
        }
        .lb-stream-btn:hover {
          opacity: 0.9;
          transform: scale(1.02);
          color: #fff;
          text-decoration: none;
        }

        /* ── Footer CTA ── */
        .lb-footer {
          text-align: center;
          margin-top: 52px;
        }
        .lb-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 34px;
          background: #0f172a;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          letter-spacing: 0.2px;
          transition: background 0.18s, transform 0.15s;
        }
        .lb-view-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
          color: #fff;
          text-decoration: none;
        }
      `}</style>

      <section className="lb-section">
        <div className="lb-container">

          {/* ── HEADER ── */}
          <div className="lb-header">
            <span className="lb-eyebrow">
              <span className="lb-eyebrow-dot" />
              Season Rankings
            </span>
            <h2 className="lb-title">
              Leader<span>board</span>
            </h2>
            <p className="lb-subtitle">Top performers of the season</p>
            <div className="lb-header-line" />
          </div>

          {/* ── LEADERBOARD CARDS ── */}
          <div className="lb-grid">
            <LeaderboardCard title="🏏 Top Batsmen" data={batsmen} />
            <LeaderboardCard title="🎯 Top Bowlers" data={bowlers} />
            <LeaderboardCard title="⭐ MVP" data={mvps} />
          </div>

          {/* ── LIVE STREAMS ── */}
          {streams.length > 0 && (
            <>
              <div className="lb-divider" />

              <div className="lb-streams-header">
                <h3 className="lb-streams-title">Live Streams</h3>
                <span className="lb-streams-badge">
                  <span className="lb-live-dot" />
                  {streams.length} Live
                </span>
              </div>

              <div className="lb-streams-grid">
                {streams.slice(0, 3).map((stream, index) => (
                  <div className="lb-stream-card" key={stream._id || index}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div className="lb-stream-icon">📺</div>
                      <div style={{ flex: 1 }}>
                        <h6 className="lb-stream-title">
                          {stream.title || "Live Match"}
                        </h6>
                        <span className="lb-stream-viewers">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          {stream.viewerCount || 0} viewers
                        </span>
                      </div>
                    </div>
                    <a href={`/live/${stream._id || index}`} className="lb-stream-btn">
                      ▶ Watch Live
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── FOOTER CTA ── */}
          <div className="lb-footer">
            <a href="/live" className="lb-view-btn">
              View Complete Leaderboard
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

        </div>
      </section>
    </>
  );
}

export default Leaderboard;