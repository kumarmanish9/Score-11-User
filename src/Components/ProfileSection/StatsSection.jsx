import "./StatsSection.css";

import React from "react";

function StatsSection({ user }) {
  const stats = user?.cricketProfile;

  const data = [
    { label: "Matches", value: stats?.matchesPlayed },
    { label: "Runs", value: stats?.totalRuns },
    { label: "Wickets", value: stats?.totalWickets },
    { label: "High Score", value: stats?.highestScore },
    { label: "Bat Avg", value: stats?.battingAverage },
    { label: "Bowl Avg", value: stats?.bowlingAverage }
  ];

  return (
    <div className="profile-section premium-section">
      <h3>Cricket Stats</h3>

      <div className="premium-grid">
        {data.map((item, index) => (
          <div className="premium-card" key={index}>
            <p className="label">{item.label}</p>
            <h2 className="value">{item.value ?? 0}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection;