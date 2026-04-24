import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MatchCard({ match }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgErrA, setImgErrA] = useState(false);
  const [imgErrB, setImgErrB] = useState(false);

  // ✅ Navigation
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/match/${match?._id || match?.id}`);
  };

  // ✅ Safe team mapping
  const teamA = match?.teamA || match?.team1 || {};
  const teamB = match?.teamB || match?.team2 || {};

  const isLive = match?.status === "live";
  const statusColor = {
    live: { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
    upcoming: { bg: "#eff6ff", text: "#2563eb", dot: "#3b82f6" },
    completed: { bg: "#f0fdf4", text: "#16a34a", dot: "#22c55e" },
  }[match?.status || "upcoming"] || { bg: "#f8fafc", text: "#64748b", dot: "#94a3b8" };

  // Initials fallback
  const initials = (team) => {
    const name = team?.shortName || team?.name || "";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mc-root {
          font-family: 'Sora', sans-serif;
          animation: fadeSlideUp 0.35s ease both;
        }
        .mc-card {
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 20px;
          padding: 24px 20px 20px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          user-select: none;
        }
        .mc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.09);
          border-color: #d0d9ea;
        }

        /* top color strip */
        .mc-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .mc-card:hover .mc-strip { opacity: 1; }

        /* live badge */
        .mc-live-badge {
          position: absolute;
          top: 16px; right: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          color: #dc2626;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          border-radius: 8px;
          padding: 3px 10px;
          text-transform: uppercase;
        }
        .mc-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
          animation: livePulse 1.4s infinite;
          flex-shrink: 0;
        }

        /* teams row */
        .mc-teams {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 8px;
          margin-bottom: 18px;
        }
        .mc-team {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .mc-logo-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid #e8edf5;
          background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s;
        }
        .mc-card:hover .mc-logo-wrap {
          box-shadow: 0 4px 16px rgba(37,99,235,0.15);
        }
        .mc-logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .mc-initials {
          font-size: 17px;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: -0.5px;
        }
        .mc-team-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          line-height: 1.25;
          margin: 0;
        }

        /* vs divider */
        .mc-vs {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .mc-vs-text {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
        }

        /* divider line */
        .mc-divider {
          height: 1px;
          background: #f1f5f9;
          margin-bottom: 14px;
          border-radius: 1px;
        }

        /* status + info */
        .mc-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .mc-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 7px;
          padding: 4px 10px;
          text-transform: capitalize;
          letter-spacing: 0.2px;
        }
        .mc-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* button */
        .mc-btn {
          width: 100%;
          padding: 11px 0;
          border: none;
          border-radius: 11px;
          background: #0f172a;
          color: #ffffff;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: background 0.18s ease, transform 0.15s ease;
          position: relative;
          overflow: hidden;
        }
        .mc-btn:hover {
          background: #1e293b;
          transform: scale(1.01);
        }
        .mc-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="mc-root">
        <div className="mc-card" onClick={handleViewDetails}>
          {/* color strip on hover */}
          <div className="mc-strip" />

          {/* LIVE BADGE */}
          {isLive && (
            <div className="mc-live-badge">
              <span className="mc-live-dot" />
              Live
            </div>
          )}

          {/* TEAMS */}
          <div className="mc-teams">
            {/* Team A */}
            <div className="mc-team">
              <div className="mc-logo-wrap">
                {teamA?.logo && !imgErrA ? (
                  <img
                    src={teamA.logo}
                    alt={teamA?.shortName || "Team A"}
                    onError={() => setImgErrA(true)}
                  />
                ) : (
                  <span className="mc-initials">{initials(teamA)}</span>
                )}
              </div>
              <h4 className="mc-team-name">
                {teamA?.shortName || teamA?.name || "Team A"}
              </h4>
            </div>

            {/* VS */}
            <div className="mc-vs">
              <div className="mc-vs-text">VS</div>
            </div>

            {/* Team B */}
            <div className="mc-team">
              <div
                className="mc-logo-wrap"
                style={{ background: "linear-gradient(135deg, #fce7f3 0%, #f5f0ff 100%)" }}
              >
                {teamB?.logo && !imgErrB ? (
                  <img
                    src={teamB.logo}
                    alt={teamB?.shortName || "Team B"}
                    onError={() => setImgErrB(true)}
                  />
                ) : (
                  <span className="mc-initials" style={{ color: "#7c3aed" }}>
                    {initials(teamB)}
                  </span>
                )}
              </div>
              <h4 className="mc-team-name">
                {teamB?.shortName || teamB?.name || "Team B"}
              </h4>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mc-divider" />

          {/* STATUS */}
          <div className="mc-info">
            <span
              className="mc-status-pill"
              style={{ background: statusColor.bg, color: statusColor.text }}
            >
              <span
                className="mc-status-dot"
                style={{ background: statusColor.dot }}
              />
              {match?.status
                ? match.status.charAt(0).toUpperCase() + match.status.slice(1)
                : "Upcoming"}
            </span>
          </div>

          {/* BUTTON */}
          <button className="mc-btn" onClick={handleViewDetails}>
            View Details
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default MatchCard;