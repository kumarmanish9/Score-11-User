import React from "react";
import "./UpcomingMatches.css";

function UpcomingMatches() {
  const matches = [
    {
      team1: "GT",
      team2: "RR",
      date: "Apr 5",
      time: "7:30 PM"
    },
    {
      team1: "SRH",
      team2: "LSG",
      date: "Apr 6",
      time: "3:30 PM"
    },
    {
      team1: "CSK",
      team2: "DC",
      date: "Apr 7",
      time: "7:30 PM"
    }
  ];

  return (
    <section className="upcoming-section">
      {/* Header */}
      <div className="section-header">
        <h2>📅 Upcoming Matches</h2>
        <span className="view-all">View All →</span>
      </div>

      {/* Match List */}
      <div className="upcoming-list">
        {matches.map((match, index) => (
          <div className="upcoming-card" key={index}>
            
            {/* Teams */}
            <div className="teams">
              <span>{match.team1}</span>
              <span className="vs">vs</span>
              <span>{match.team2}</span>
            </div>

            {/* Date & Time */}
            <div className="match-info">
              <span>{match.date}</span>
              <span>{match.time}</span>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingMatches;