import React from 'react';
import PlayerCard from '../HomeSection/PlayerCard';

export default function TeamLineup({ team, captain, viceCaptain, onRemove, onSetCaptain, onSetViceCaptain, onSubmit, loading }){
  return (
    <div className="p-4">
      <label className="form-label fw-semibold text-gray-700 mb-3 d-block">3. Team Lineup</label>

      <div className="row g-2 mb-4">
        {team.map((player, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-2">
            <div className={`position-relative p-3 rounded-2 border h-100 ${player ? 'border-primary bg-primary-subtle' : 'border-dashed border-gray-300 bg-gray-50'}`}>
              {player ? (
                <div>
                  <small className="text-muted d-block mb-1">#{index + 1}</small>
                  <PlayerCard {...player} rank={index + 1} />
                  {(captain?._id === player._id || viceCaptain?._id === player._id) && (
                    <span className="position-absolute top-0 end-0 badge bg-success">{captain?._id === player._id ? 'C' : 'VC'}</span>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted"><small>Empty Slot</small></div>
              )}
              {player && (
                <button className="btn btn-sm btn-outline-danger position-absolute top-0 start-0 m-1" onClick={() => onRemove(index + 1)}>×</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Captain</label>
          <select className="form-select" value={captain?._id || ''} onChange={(e) => onSetCaptain(parseInt(e.target.value))}>
            <option value="">Select Captain</option>
            {team.filter(Boolean).map((player, index) => (
              <option key={player._id} value={index}>{`#${index + 1} ${player.name}`}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Vice Captain</label>
          <select className="form-select" value={viceCaptain?._id || ''} onChange={(e) => onSetViceCaptain(parseInt(e.target.value))}>
            <option value="">Select Vice Captain</option>
            {team.filter(Boolean).map((player, index) => (
              <option key={player._id} value={index}>{`#${index + 1} ${player.name}`}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary btn-lg w-100" onClick={onSubmit} disabled={loading || team.filter(Boolean).length !== 11}>
        {loading ? 'Creating Team...' : 'Create Team & Save'}
      </button>
    </div>
  );
}
