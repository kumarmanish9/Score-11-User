import React from "react";
import "./MatchCard.css";
import { useNavigate } from "react-router-dom";

function MatchCard({ match }) {
  const navigate = useNavigate();

  return (
    <div
      className="match-card"
      onClick={() => navigate(`/matches/${match.id}`)}
    >
      <div className="teams">
        <div className="team">
          <h4>{match.team1?.shortName}</h4>
        </div>

        <span className="vs">vs</span>

        <div className="team">
          <h4>{match.team2?.shortName}</h4>
        </div>
      </div>

      <div className="match-info">
        <p>Status: {match.status || "Upcoming"}</p>
      </div>

      <button className="view-btn">View Details</button>
    </div>
  );
}

export default MatchCard;