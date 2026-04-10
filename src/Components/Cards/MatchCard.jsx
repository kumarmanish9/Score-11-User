import React from "react";

function MatchCard({ match, type = "live" }) {

  // ✅ Safe Team Name
  const getTeamName = (team) => {
    if (!team) return "Team";
    if (typeof team === "string") return team;
    return team.shortName || team.name || "Team";
  };

  // ✅ Teams
  const teamA = match?.teamA || match?.team1;
  const teamB = match?.teamB || match?.team2;

  // ✅ Winner
  const getWinner = () => {
    if (!match?.result) return "";

    const winner = match.result.winner;

    if (typeof winner === "object") return getTeamName(winner);

    if (winner === match?.team1?._id) return getTeamName(match.team1);
    if (winner === match?.team2?._id) return getTeamName(match.team2);

    return match.result.winnerName || "";
  };

  return (
    <div className="match-card">

      {/* 🔴 Header */}
      <div className="match-header">
        <span className={`live-badge`}>
          {match?.status || "LIVE"}
        </span>

        {/* Show overs only in live */}
        {type === "live" && (
          <span className="overs">{match?.overs || 0} Ov</span>
        )}
      </div>

      {/* 🏏 Team 1 */}
      <div className="team-row">
        <span className="team-name">{getTeamName(teamA)}</span>

        {/* Show score only in live */}
        {type === "live" && (
          <span className="team-score">
            {match?.scoreA || "-"}
          </span>
        )}
      </div>

      {/* 🏏 Team 2 */}
      <div className="team-row">
        <span className="team-name">{getTeamName(teamB)}</span>

        {type === "live" && (
          <span className="team-score">
            {match?.scoreB || "-"}
          </span>
        )}
      </div>

      {/* 📊 STATUS SECTION */}
      <p className="match-status">

        {/* LIVE */}
        {type === "live" && match?.status}

        {/* UPCOMING */}
        {type === "upcoming" && (
          match?.scheduledDate
            ? new Date(match.scheduledDate).toDateString()
            : "Upcoming"
        )}

        {/* COMPLETED */}
        {type === "completed" && match?.result && (
          <>
            {getWinner()}{" "}
            {match.result.margin
              ? `won by ${match.result.margin}`
              : ""}
          </>
        )}

      </p>

    </div>
  );
}

export default MatchCard;