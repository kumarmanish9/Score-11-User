import React from "react";
import "./Players.css";

function PlayerCard({ name, team, runs, wickets, img }) {
  return (
    <div className="player-card">
      <div className="player-img">
        <img src={img} alt={name} />
      </div>

      <h3>{name}</h3>
      <p className="team">{team}</p>

      <div className="stats">
        <div>
          <span>Runs</span>
          <strong>{runs}</strong>
        </div>
        <div>
          <span>Wickets</span>
          <strong>{wickets}</strong>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;