import React from "react";

function PlayerCard({ name, team, runs, wickets, img, rank }) {
  if (!name) {
    return <div className="player-card placeholder">Loading player...</div>;
  }

  return (
    <div className="player-card">
      {rank && <div className="rank-badge">#{rank}</div>}
      <div className="player-img">
        <img src={img || 'https://via.placeholder.com/80x80/007bff/ffffff?text=P'} alt={name} />
      </div>

      <h3>{name}</h3>
      <p className="team">{team?.name || team?.shortName || team || 'Unknown Team'}</p>

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
    </div>
  );
}

export default PlayerCard;
