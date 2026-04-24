import React, { useEffect, useState } from "react";
import PlayerCard from "../Cards/PlayerCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .psl-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .psl-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 14px;
    display: block;
  }

  /* Search bar */
  .psl-search-wrap {
    position: relative;
    margin-bottom: 18px;
  }

  .psl-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #bbb;
    font-size: 13px;
    pointer-events: none;
  }

  .psl-search-input {
    width: 100%;
    border: 1.5px solid #efefef;
    border-radius: 12px;
    padding: 10px 14px 10px 38px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #333;
    background: #f7f7f7;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .psl-search-input::placeholder { color: #bbb; }

  .psl-search-input:focus {
    border-color: #ccc;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
  }

  /* Clear button */
  .psl-clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: #e8e8e8;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 11px;
    color: #888;
    transition: background 0.15s;
    padding: 0;
    line-height: 1;
  }

  .psl-clear:hover { background: #ddd; color: #444; }

  /* Count pill */
  .psl-count {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    color: #aaa;
    margin-bottom: 14px;
  }

  .psl-count-num {
    background: #f0f0f0;
    border-radius: 20px;
    padding: 2px 8px;
    color: #666;
    font-size: 11px;
    font-weight: 700;
  }

  /* Grid */
  .psl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }

  /* Player item */
  .psl-item {
    border-radius: 14px;
    border: 1.5px solid #efefef;
    background: #fafafa;
    padding: 4px;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.18s;
    position: relative;
    overflow: hidden;
  }

  .psl-item:hover:not(.psl-item--selected) {
    border-color: #d5d5d5;
    background: #f4f4f4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.07);
  }

  .psl-item--selected {
    border-color: #111;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    cursor: default;
  }

  .psl-item--selected::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #111 0%, #555 100%);
    border-radius: 3px 3px 0 0;
  }

  /* Selected checkmark */
  .psl-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 18px;
    height: 18px;
    background: #111;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #fff;
    font-weight: 700;
    z-index: 1;
  }

  /* Empty */
  .psl-empty {
    text-align: center;
    padding: 40px 0;
    color: #ccc;
    font-size: 13px;
  }

  .psl-empty-icon {
    font-size: 28px;
    margin-bottom: 8px;
    display: block;
    opacity: 0.4;
  }
`;

export default function PlayerSearchList({
  players = [],
  searchQuery,
  onSearchChange,
  onAddPlayer,
  team = [],
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || "");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(delay);
  }, [localQuery]);

  const visible = players.slice(0, 24);

  return (
    <>
      <style>{styles}</style>
      <div className="psl-wrap">
        <span className="psl-label">2 · Search & Add Players</span>

        {/* Search */}
        <div className="psl-search-wrap">
          <span className="psl-search-icon">🔍</span>
          <input
            type="text"
            className="psl-search-input"
            placeholder="Search players by name or team..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          {localQuery && (
            <button className="psl-clear" onClick={() => setLocalQuery("")}>
              ✕
            </button>
          )}
        </div>

        {/* Count */}
        {players.length > 0 && (
          <div className="psl-count">
            Showing
            <span className="psl-count-num">
              {Math.min(players.length, 24)}
            </span>
            players
          </div>
        )}

        {/* Content */}
        {players.length === 0 ? (
          <div className="psl-empty">
            <span className="psl-empty-icon">🏏</span>
            No players found
          </div>
        ) : (
          <div className="psl-grid">
            {visible.map((player, index) => {
              const isSelected = team.some((p) => p && p._id === player._id);
              const playerName = player.name || player.playerName || "Unknown";

              return (
                <div
                  key={player._id || index}
                  className={`psl-item ${isSelected ? "psl-item--selected" : ""}`}
                  onClick={() => { if (!isSelected) onAddPlayer(player); }}
                >
                  {isSelected && <span className="psl-check">✓</span>}
                  <PlayerCard
                    _id={player._id}
                    name={playerName}
                    playerName={playerName}
                    team={player.team}
                    rank={index + 1}
                    compact
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}