import React from "react";
import "./Leaderboard.css";

function Leaderboard() {
  const players = [
    { name: "Virat Kohli", points: 1200 },
    { name: "Rohit Sharma", points: 1100 },
    { name: "MS Dhoni", points: 980 },
    { name: "KL Rahul", points: 920 },
    { name: "Hardik Pandya", points: 870 }
  ];

  return (
    <section className="leaderboard-section">
      
      {/* Header */}
      <div className="section-header">
        <h2>🏆 Leaderboard</h2>
        <span className="view-all">View All →</span>
      </div>

      {/* Top 3 Highlight */}
      <div className="top-players">
        {players.slice(0, 3).map((player, index) => (
          <div className={`top-card rank-${index + 1}`} key={index}>
            <div className="rank">#{index + 1}</div>
            <img
              src={`https://i.pravatar.cc/40?img=${index + 5}`}
              alt="player"
            />
            <h4>{player.name}</h4>
            <p>{player.points} pts</p>
          </div>
        ))}
      </div>

      {/* Remaining Players */}
      <div className="leaderboard-list">
        {players.slice(3).map((player, index) => (
          <div className="leaderboard-item" key={index}>
            <span className="rank">#{index + 4}</span>
            <span className="name">{player.name}</span>
            <span className="points">{player.points} pts</span>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Leaderboard;