import React from 'react';
import PlayerCard from '../HomeSection/PlayerCard';

export default function PlayerSearchList({ players, searchQuery, onSearchChange, onAddPlayer }){
  return (
    <div className="p-4 border-bottom">
      <label className="form-label fw-semibold text-gray-700 mb-3 d-block">2. Search & Add Players</label>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="row g-2">
        {players.slice(0, 24).map((player, index) => (
          <div key={player._id || index} className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2">
            <div className="player-select-item d-flex align-items-center justify-content-between p-1">
              <PlayerCard {...player} rank={index + 1} compact />
              <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => onAddPlayer(player)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
