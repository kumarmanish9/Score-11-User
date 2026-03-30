import React from "react";
import LeaderboardCard from "./LeaderboardCard";
import "./Leaderboard.css";

function Leaderboard() {
  const batsmen = [
    { name: "Virat Kohli", score: "650 Runs" },
    { name: "Rohit Sharma", score: "580 Runs" },
    { name: "Gill", score: "540 Runs" },
  ];

  const bowlers = [
    { name: "Bumrah", score: "22 Wickets" },
    { name: "Shami", score: "19 Wickets" },
    { name: "Siraj", score: "17 Wickets" },
  ];

  const mvp = [
    { name: "Hardik Pandya", score: "820 Points" },
    { name: "Ravindra Jadeja", score: "780 Points" },
    { name: "Stokes", score: "720 Points" },
  ];

  return (
    <section className="leaderboard-section">
      <div className="container">
        <h2 className="section-title">Leaderboard</h2>

        <div className="leaderboard-grid">
          <LeaderboardCard title="Top Batsmen" data={batsmen} />
          <LeaderboardCard title="Top Bowlers" data={bowlers} />
          <LeaderboardCard title="MVP" data={mvp} />
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;