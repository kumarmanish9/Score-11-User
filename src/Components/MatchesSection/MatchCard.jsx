import React from "react";
import "./MatchCard.css";
import { useNavigate } from "react-router-dom";

function MatchCard({ match }) {
  const navigate = useNavigate();

  // ✅ Handle navigation safely
  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/match/${match?._id || match?.id}`);
  };

  // ✅ Safe data handling (backend friendly)
  const teamA = match?.teamA || match?.team1 || {};
  const teamB = match?.teamB || match?.team2 || {};

  return (
    <div className="match-card" onClick={handleViewDetails}>

      {/* Teams */}
      <div className="teams">
        <div className="team">
          <h4>{teamA?.shortName || teamA?.name || "Team A"}</h4>
        </div>

        <span className="vs">vs</span>

        <div className="team">
          <h4>{teamB?.shortName || teamB?.name || "Team B"}</h4>
        </div>
      </div>

      {/* Match Info */}
      <div className="match-info">
        <p>Status: {match?.status || "Upcoming"}</p>
      </div>

      {/* Button */}
      <button className="view-btn" onClick={handleViewDetails}>
        View Details
      </button>

    </div>
  );
}

export default MatchCard;