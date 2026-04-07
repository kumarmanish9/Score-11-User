import React from "react";
import "./MatchCard.css";
import { useNavigate } from "react-router-dom";

function MatchCard({ match }) {
  const navigate = useNavigate();

  // ✅ Navigation
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/match/${match?._id || match?.id}`);
  };

  // ✅ Safe team mapping
  const teamA = match?.teamA || match?.team1 || {};
  const teamB = match?.teamB || match?.team2 || {};

  return (
    <div className="match-card" onClick={handleViewDetails}>

      {/* 🔴 LIVE BADGE */}
      {match?.status === "live" && (
        <div className="live-badge">LIVE</div>
      )}

      {/* 🏏 TEAMS */}
      <div className="teams">

        {/* TEAM A */}
        <div className="team">
          <img
            src={teamA?.logo || "/default-team.png"}
            alt="teamA"
            className="team-logo"
          />
          <h4>{teamA?.shortName || teamA?.name || "Team A"}</h4>
        </div>

        <span className="vs">vs</span>

        {/* TEAM B */}
        <div className="team">
          <img
            src={teamB?.logo || "/default-team.png"}
            alt="teamB"
            className="team-logo"
          />
          <h4>{teamB?.shortName || teamB?.name || "Team B"}</h4>
        </div>

      </div>

      {/* 📊 MATCH INFO */}
      <div className="match-info">
        <p>
          Status:{" "}
          <span className={`status ${match?.status || "upcoming"}`}>
            {match?.status || "Upcoming"}
          </span>
        </p>
      </div>

      {/* 🔘 BUTTON */}
      <button className="view-btn" onClick={handleViewDetails}>
        View Details
      </button>

    </div>
  );
}

export default MatchCard;