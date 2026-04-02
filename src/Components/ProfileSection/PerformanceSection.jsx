import React from "react";

function PerformanceSection({ user }) {
  const stats = user?.stats;

  const data = [
    { label: "Matches Won", value: stats?.matchesWon },
    { label: "Matches Lost", value: stats?.matchesLost },
    { label: "Tournaments Won", value: stats?.tournamentsWon },
    { label: "MOTM Awards", value: stats?.manOfTheMatch }
  ];

  return (
    <div className="performance-section">
      <h3>Performance</h3>

      <div className="performance-grid">
        {data.map((item, index) => (
          <div className="performance-card" key={index}>
            <h2>{item.value ?? 0}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceSection;