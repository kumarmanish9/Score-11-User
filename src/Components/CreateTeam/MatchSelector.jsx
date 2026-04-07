import React from 'react';

export default function MatchSelector({ matches, matchType, setMatchType, selectedMatch, onSelectMatch }){
  return (
    <div className="p-4 border-bottom">
      <label className="form-label fw-semibold text-gray-700 mb-3 d-block">1. Select Match</label>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="btn-group" role="group" aria-label="match type">
          <button type="button" className={`btn btn-sm ${matchType === 'upcoming' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('upcoming')}>Upcoming</button>
          <button type="button" className={`btn btn-sm ${matchType === 'live' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('live')}>Live</button>
          <button type="button" className={`btn btn-sm ${matchType === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setMatchType('completed')}>Completed</button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {matches.map(match => (
          <div key={match._id} className="col-md-6">
            <div className={`card hover-lift cursor-pointer p-3 ${selectedMatch?._id === match._id ? 'border-primary' : ''}`} onClick={() => onSelectMatch(match)}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1">{typeof match.team1 === 'object' ? (match.team1.shortName || match.team1.name) : match.team1} vs {typeof match.team2 === 'object' ? (match.team2.shortName || match.team2.name) : match.team2}</h6>
                  <small className="text-muted">{match.date} | {match.time}</small>
                </div>
                {selectedMatch?._id === match._id && (<span className="badge bg-primary">Selected</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
