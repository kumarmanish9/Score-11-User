import React from "react";
import PlayerCard from "../Cards/PlayerCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .tl-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .tl-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tl-count-pill {
    background: #f0f0f0;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 700;
    color: #666;
  }

  .tl-count-pill.full {
    background: #dcfce7;
    color: #16a34a;
  }

  /* Player grid */
  .tl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
    margin-bottom: 22px;
  }

  /* Slot */
  .tl-slot {
    border-radius: 14px;
    border: 1.5px dashed #e5e5e5;
    background: #fafafa;
    padding: 10px 8px 8px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: border-color 0.18s, background 0.18s;
  }

  .tl-slot.filled {
    border-style: solid;
    border-color: #e5e5e5;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }

  .tl-slot.is-captain {
    border-color: #f5c500;
    background: #fffdf0;
  }

  .tl-slot.is-vc {
    border-color: #a8b8d0;
    background: #f4f7fb;
  }

  .tl-slot-num {
    font-size: 10px;
    font-weight: 700;
    color: #ccc;
    display: block;
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }

  .tl-slot-empty {
    font-size: 11px;
    color: #ccc;
    text-align: center;
  }

  /* Role badge */
  .tl-role-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 800;
    z-index: 2;
    letter-spacing: 0;
  }

  .tl-role-badge.c  { background: #f5c500; color: #fff; }
  .tl-role-badge.vc { background: #6b8cae; color: #fff; }

  /* Remove btn */
  .tl-remove {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #999;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    z-index: 2;
    padding: 0;
    line-height: 1;
  }

  .tl-remove:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc2626;
  }

  /* Selects row */
  .tl-selects {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    .tl-selects { grid-template-columns: 1fr; }
  }

  .tl-select-group label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 7px;
  }

  .tl-select-group label .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .captain-dot  { background: #f5c500; }
  .vc-dot       { background: #6b8cae; }

  .tl-select {
    width: 100%;
    border: 1.5px solid #efefef;
    border-radius: 12px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    background: #f7f7f7;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .tl-select:focus {
    border-color: #ccc;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
  }

  /* Submit button */
  .tl-submit {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    letter-spacing: 0.01em;
  }

  .tl-submit:not(:disabled) {
    background: #111;
    color: #fff;
    box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  }

  .tl-submit:not(:disabled):hover {
    background: #222;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.22);
  }

  .tl-submit:not(:disabled):active {
    transform: translateY(0);
  }

  .tl-submit:disabled {
    background: #f0f0f0;
    color: #bbb;
    cursor: not-allowed;
  }

  /* Loading spinner */
  .tl-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function TeamLineup({
  team,
  captain,
  viceCaptain,
  onRemove,
  onSetCaptain,
  onSetViceCaptain,
  onSubmit,
  loading,
}) {
  const filledCount = team.filter(Boolean).length;
  const isFull = filledCount === 11;

  return (
    <>
      <style>{styles}</style>
      <div className="tl-wrap">
        {/* Header */}
        <div className="tl-label">
          <span>3 · Team Lineup</span>
          <span className={`tl-count-pill ${isFull ? "full" : ""}`}>
            {filledCount} / 11
          </span>
        </div>

        {/* Player slots */}
        <div className="tl-grid">
          {team.map((player, index) => {
            const isCaptain = captain?._id === player?._id && player;
            const isViceCaptain = viceCaptain?._id === player?._id && player;

            return (
              <div
                key={index}
                className={`tl-slot ${player ? "filled" : ""} ${isCaptain ? "is-captain" : ""} ${isViceCaptain ? "is-vc" : ""}`}
              >
                {player ? (
                  <>
                    <button className="tl-remove" onClick={() => onRemove(index + 1)}>✕</button>
                    {isCaptain && <span className="tl-role-badge c">C</span>}
                    {isViceCaptain && <span className="tl-role-badge vc">VC</span>}
                    <div style={{ width: "100%" }}>
                      <span className="tl-slot-num">#{index + 1}</span>
                      <PlayerCard {...player} rank={index + 1} compact />
                    </div>
                  </>
                ) : (
                  <div className="tl-slot-empty">Empty</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Captain / VC selects */}
        <div className="tl-selects">
          <div className="tl-select-group">
            <label>
              <span className="badge-dot captain-dot" />
              Captain
            </label>
            <select
              className="tl-select"
              value={captain?._id || ""}
              onChange={(e) => onSetCaptain(parseInt(e.target.value))}
            >
              <option value="">Select Captain</option>
              {team.filter(Boolean).map((player, index) => (
                <option key={player._id} value={index}>
                  #{index + 1} {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="tl-select-group">
            <label>
              <span className="badge-dot vc-dot" />
              Vice Captain
            </label>
            <select
              className="tl-select"
              value={viceCaptain?._id || ""}
              onChange={(e) => onSetViceCaptain(parseInt(e.target.value))}
            >
              <option value="">Select Vice Captain</option>
              {team.filter(Boolean).map((player, index) => (
                <option key={player._id} value={index}>
                  #{index + 1} {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          className="tl-submit"
          onClick={onSubmit}
          disabled={loading || !isFull}
        >
          {loading ? (
            <>
              <span className="tl-spinner" />
              Creating Team...
            </>
          ) : (
            "Create Team & Save"
          )}
        </button>
      </div>
    </>
  );
}