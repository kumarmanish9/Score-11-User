import React from "react";

function Teams({ teamA, teamB, playerMap }) {
  return (
    <div>

      <h4>{teamA.name} Players</h4>
      {teamA.players?.map((p, i) => (
        <p key={i}>{playerMap[p._id]}</p>
      ))}

      <h4 className="mt-3">{teamB.name} Players</h4>
      {teamB.players?.map((p, i) => (
        <p key={i}>{playerMap[p._id]}</p>
      ))}

    </div>
  );
}

export default Teams;