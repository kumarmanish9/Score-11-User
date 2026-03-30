function MatchCard({ match }) {
  return (
    <div className="match-card">

      {/* Header */}
      <div className="match-header">
        <span className="live-badge">LIVE</span>
        <span className="overs">{match.overs} Ov</span>
      </div>

      {/* Team 1 */}
      <div className="team-row">
        <span className="team-name">{match.teamA}</span>
        <span className="team-score">{match.scoreA}</span>
      </div>

      {/* Team 2 */}
      <div className="team-row">
        <span className="team-name">{match.teamB}</span>
        <span className="team-score">{match.scoreB}</span>
      </div>

      {/* Status */}
      <p className="match-status">{match.status}</p>

    </div>
  );
}

export default MatchCard;