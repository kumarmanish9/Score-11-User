import React from "react";
import "./PlayerCard.css";

function PlayerCard({ name, team, runs, wickets, img, rank, compact }) {
  if (!name) {
    return (
      <div className={`player-card placeholder ${compact ? "compact" : ""}`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`player-card ${compact ? "compact" : ""}`}>
      
      {/* Rank Badge */}
      {rank && <div className="rank-badge">#{rank}</div>}

      {/* Player Image */}
      <div className="player-img">
        <img
          src={img || "https://via.placeholder.com/80x80/007bff/ffffff?text=P"}
          alt={name}
        />
      </div>

      {/* Player Info */}
      <div className="player-info">
        <h4 className="player-name">{name}</h4>

        <p className="team">
          {team?.name || team?.shortName || "Team"}
        </p>

        {/* Stats only in normal mode */}
        {!compact && (
          <div className="stats">
            <div>
              <span>Runs</span>
              <strong>{runs || 0}</strong>
            </div>
            <div>
              <span>Wickets</span>
              <strong>{wickets || 0}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;