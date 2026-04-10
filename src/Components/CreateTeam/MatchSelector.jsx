import React from 'react';

export default function MatchSelector({ matches, matchType, setMatchType, selectedMatch, onSelectMatch }) {

  // ✅ ADD THIS HERE
  const getTeamName = (team) => {
    if (!team) return "N/A";
    if (typeof team === "object") {
      return team.shortName || team.name || "N/A";
    }
    return team;
  };

  return (
    <div className="p-4 border-bottom">
      <label className="form-label fw-semibold text-gray-700 mb-3 d-block">1. Select Match</label>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="btn-group">
          <button className={`btn btn-sm ${matchType === 'upcoming' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('upcoming')}>Upcoming</button>
          <button className={`btn btn-sm ${matchType === 'live' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('live')}>Live</button>
          <button className={`btn btn-sm ${matchType === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('completed')}>Completed</button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {matches?.map(match => (
          <div key={match._id} className="col-md-6">
            <div
              className={`card p-3 ${selectedMatch?._id === match._id ? 'border-primary' : ''}`}
              onClick={() => onSelectMatch(match)}
            >
              <h6 className="fw-bold mb-1">
                {getTeamName(match.team1)} vs {getTeamName(match.team2)}
              </h6>

              <small className="text-muted">
                {match.date} | {match.time}
              </small>

              {selectedMatch?._id === match._id && (
                <span className="badge bg-primary">Selected</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}