// 📁 src/components/PlayerSearchList.jsx

import React, { useEffect, useState } from "react";
import PlayerCard from "../Cards/PlayerCard";

export default function PlayerSearchList({
  players = [],
  searchQuery,
  onSearchChange,
  onAddPlayer,
  team = [],
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || "");

  // ✅ Debounce search (IMPORTANT)
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);

    return () => clearTimeout(delay);
  }, [localQuery]);

  return (
    <div className="p-4 border-bottom">
      <label className="form-label fw-semibold text-gray-700 mb-3 d-block">
        2. Search & Add Players
      </label>

      {/* 🔍 Search Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search players..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>

      {/* ❌ No Players Found */}
      {players.length === 0 ? (
        <div className="text-center text-muted py-4">
          No players found
        </div>
      ) : (
        <div className="row g-2">
          {players.slice(0, 24).map((player, index) => {
            const isSelected = team.some(
              (p) => p && p._id === player._id
            );

            const playerName =
              player.name || player.playerName || "Unknown";

            return (
              <div
                key={player._id || index}
                className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"
              >
                <div
                  className={`player-select-item ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (!isSelected) {
                      onAddPlayer(player);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid #0d6efd"
                      : "1px solid #e5e7eb",
                    background: isSelected ? "#e7f0ff" : "#f8fafc",
                    borderRadius: "8px",
                    padding: "4px",
                    transition: "0.2s",
                  }}
                >
                  <PlayerCard
                    _id={player._id}
                    name={playerName}
                    playerName={playerName}
                    team={player.team}
                    rank={index + 1}
                    compact
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}