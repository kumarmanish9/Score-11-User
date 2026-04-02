import React from "react";
import "./LiveMatches.css";

function LiveMatches() {
  const matches = [
    {
      team1: "MI",
      team2: "CSK",
      status: "Live",
      score: "MI 120/3 (14.2)"
    },
    {
      team1: "RCB",
      team2: "KKR",
      status: "Live",
      score: "RCB 89/2 (10.1)"
    },
    {
      team1: "DC",
      team2: "PBKS",
      status: "Live",
      score: "DC 150/5 (18.4)"
    }
  ];

  return (
    <section className="live-section">
      {/* Header */}
      <div className="section-header">
        <h2>🔥 Live Matches</h2>
        <span className="view-all">View All →</span>
      </div>
      <div className="section-header">
        <h2>🔥 Live Matches</h2>
        <span className="view-all">View All →</span>
      </div>


      {/* Cards */}
      <div className="match-list">
        {matches.map((match, index) => (
          <div className="match-card" key={index}>
            <div className="match-top">
              <span className="live-badge">LIVE</span>
            </div>

            <div className="teams">
              <h3>{match.team1}</h3>
              <span>vs</span>
              <h3>{match.team2}</h3>
            </div>

            <p className="score">{match.score}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LiveMatches;