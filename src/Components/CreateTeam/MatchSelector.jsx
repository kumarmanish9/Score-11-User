import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ms-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .ms-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 14px;
    display: block;
  }

  /* Tab toggle */
  .ms-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 18px;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 4px;
    width: fit-content;
  }

  .ms-tab {
    padding: 7px 18px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    white-space: nowrap;
  }

  .ms-tab.active {
    background: #ffffff;
    color: #111;
    font-weight: 600;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  .ms-tab:not(.active):hover {
    color: #444;
  }

  /* Live dot */
  .ms-live-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    margin-right: 5px;
    animation: pulse 1.4s infinite;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.3); }
  }

  /* Match grid */
  .ms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 10px;
    max-height: 320px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .ms-grid::-webkit-scrollbar { width: 4px; }
  .ms-grid::-webkit-scrollbar-track { background: transparent; }
  .ms-grid::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

  /* Match card */
  .ms-card {
    border-radius: 14px;
    border: 1.5px solid #efefef;
    padding: 14px;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.15s, box-shadow 0.18s;
    background: #fafafa;
    position: relative;
    overflow: hidden;
  }

  .ms-card:hover {
    border-color: #d5d5d5;
    background: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.07);
  }

  .ms-card.selected {
    border-color: #111;
    background: #fff;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  }

  .ms-card.selected::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #111 0%, #555 100%);
    border-radius: 3px 3px 0 0;
  }

  .ms-teams {
    font-size: 14px;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px;
    font-family: 'Playfair Display', serif;
    line-height: 1.3;
  }

  .ms-meta {
    font-size: 12px;
    color: #aaa;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  .ms-meta-dot {
    width: 3px;
    height: 3px;
    background: #ccc;
    border-radius: 50%;
    display: inline-block;
  }

  .ms-badge {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    background: #111;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
  }

  .ms-empty {
    text-align: center;
    padding: 32px 0;
    color: #ccc;
    font-size: 13px;
    grid-column: 1 / -1;
  }
`;

export default function MatchSelector({
  matches,
  matchType,
  setMatchType,
  selectedMatch,
  onSelectMatch,
}) {
  const getTeamName = (team) => {
    if (!team) return "N/A";
    if (typeof team === "object") return team.shortName || team.name || "N/A";
    return team;
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "live",     label: "Live" },
    { key: "completed",label: "Completed" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ms-wrap">
        <span className="ms-label">1 · Select Match</span>

        {/* Tabs */}
        <div className="ms-tabs">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`ms-tab ${matchType === key ? "active" : ""}`}
              onClick={() => setMatchType(key)}
            >
              {key === "live" && matchType === "live" && (
                <span className="ms-live-dot" />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="ms-grid">
          {matches?.length ? (
            matches.map((match) => {
              const isSelected = selectedMatch?._id === match._id;
              return (
                <div
                  key={match._id}
                  className={`ms-card ${isSelected ? "selected" : ""}`}
                  onClick={() => onSelectMatch(match)}
                >
                  <p className="ms-teams">
                    {getTeamName(match.team1)} vs {getTeamName(match.team2)}
                  </p>
                  <div className="ms-meta">
                    <span>{match.date}</span>
                    {match.time && (
                      <>
                        <span className="ms-meta-dot" />
                        <span>{match.time}</span>
                      </>
                    )}
                  </div>
                  {isSelected && (
                    <span className="ms-badge">✓ Selected</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="ms-empty">No matches found</div>
          )}
        </div>
      </div>
    </>
  );
}