import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .mc-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #efefef;
    padding: 16px 18px 14px;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 14px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.18s, box-shadow 0.18s;
    position: relative;
    overflow: hidden;
  }

  .mc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 26px rgba(0,0,0,0.09);
  }

  /* top accent line per type */
  .mc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }

  .mc-card.type-live::before    { background: linear-gradient(90deg,#ef4444,#f97316); }
  .mc-card.type-upcoming::before{ background: linear-gradient(90deg,#6366f1,#8b5cf6); }
  .mc-card.type-completed::before{ background: linear-gradient(90deg,#22c55e,#10b981); }

  /* ── Header ── */
  .mc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .mc-badge.live     { background: #fee2e2; color: #dc2626; }
  .mc-badge.upcoming { background: #ede9fe; color: #7c3aed; }
  .mc-badge.completed{ background: #dcfce7; color: #16a34a; }

  .mc-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
    animation: mc-pulse 1.3s infinite;
    display: inline-block;
    flex-shrink: 0;
  }

  @keyframes mc-pulse {
    0%,100% { opacity:1; transform:scale(1);   }
    50%      { opacity:.5; transform:scale(1.4); }
  }

  .mc-overs {
    font-size: 11px;
    font-weight: 600;
    color: #bbb;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 3px 10px;
  }

  /* ── Divider ── */
  .mc-divider {
    height: 1px;
    background: #f5f5f5;
  }

  /* ── Team rows ── */
  .mc-teams {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .mc-team-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-score {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .mc-vs {
    font-size: 10px;
    font-weight: 700;
    color: #ddd;
    letter-spacing: 0.05em;
    text-align: center;
  }

  /* ── Status footer ── */
  .mc-status {
    font-size: 12px;
    font-weight: 500;
    color: #aaa;
    margin: 0;
    line-height: 1.4;
    padding-top: 2px;
    border-top: 1px solid #f5f5f5;
  }

  .mc-status.winner {
    color: #16a34a;
    font-weight: 600;
  }

  .mc-status.upcoming-date {
    color: #7c3aed;
    font-weight: 600;
  }
`;

function MatchCard({ match, type = "live" }) {

  const getTeamName = (team) => {
    if (!team) return "Team";
    if (typeof team === "string") return team;
    return team.shortName || team.name || "Team";
  };

  const teamA = match?.teamA || match?.team1;
  const teamB = match?.teamB || match?.team2;

  const getWinner = () => {
    if (!match?.result) return "";
    const winner = match.result.winner;
    if (typeof winner === "object") return getTeamName(winner);
    if (winner === match?.team1?._id) return getTeamName(match.team1);
    if (winner === match?.team2?._id) return getTeamName(match.team2);
    return match.result.winnerName || "";
  };

  const badgeClass = type === "live" ? "live" : type === "upcoming" ? "upcoming" : "completed";

  const statusText = () => {
    if (type === "live") return match?.status || "LIVE";
    if (type === "upcoming") {
      return match?.scheduledDate
        ? new Date(match.scheduledDate).toDateString()
        : "Upcoming";
    }
    if (type === "completed" && match?.result) {
      const winner = getWinner();
      const margin = match.result.margin ? `won by ${match.result.margin}` : "";
      return winner ? `${winner} ${margin}`.trim() : "Match Completed";
    }
    return "";
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`mc-card type-${type}`}>

        {/* Header */}
        <div className="mc-header">
          <span className={`mc-badge ${badgeClass}`}>
            {type === "live" && <span className="mc-live-dot" />}
            {type === "live" ? (match?.status || "Live") : type === "upcoming" ? "Upcoming" : "Completed"}
          </span>
          {type === "live" && (
            <span className="mc-overs">{match?.overs || 0} Ov</span>
          )}
        </div>

        {/* Teams */}
        <div className="mc-teams">
          <div className="mc-team-row">
            <span className="mc-team-name">{getTeamName(teamA)}</span>
            {type === "live" && (
              <span className="mc-score">{match?.scoreA || "—"}</span>
            )}
          </div>

          <div className="mc-vs">VS</div>

          <div className="mc-team-row">
            <span className="mc-team-name">{getTeamName(teamB)}</span>
            {type === "live" && (
              <span className="mc-score">{match?.scoreB || "—"}</span>
            )}
          </div>
        </div>

        {/* Status footer */}
        {statusText() && (
          <p className={`mc-status ${type === "completed" && match?.result ? "winner" : type === "upcoming" ? "upcoming-date" : ""}`}>
            {statusText()}
          </p>
        )}

      </div>
    </>
  );
}

export default MatchCard;