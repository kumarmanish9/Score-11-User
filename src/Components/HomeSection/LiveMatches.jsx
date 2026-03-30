import React, { useState } from "react";
import "./LiveMatches.css";
import MatchCard from "./MatchCard";

function LiveMatches() {

  const matchData = {
    live: [
      {
        teamA: "Team A",
        teamB: "Team B",
        scoreA: "120/3",
        scoreB: "-",
        overs: "15.2",
        status: "Team A batting",
      },
      {
        teamA: "Team c",
        teamB: "Team D",
        scoreA: "120/3",
        scoreB: "-",
        overs: "15.2",
        status: "Team C batting",
      },
    ],

    upcoming: [
      {
        teamA: "India",
        teamB: "Australia",
        time: "Today 7:00 PM",
      },
      {
        teamA: "Australia",
        teamB: "India",
        time: "Today 9:00 PM",
      },
    ],

    completed: [
      {
        teamA: "RCB",
        teamB: "KKR",
        result: "RCB won by 5 wickets",
      },
      {
        teamA: "CSK",
        teamB: "MI",
        result: "CSK won by 5 wickets",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState("live");

  return (
    <section className="live-section">
      <div className="container">

        {/* Title */}
        <h2 className="section-title">Live Matches</h2>

        {/* ✅ Tabs Fixed */}
        <div className="tabs">
          <button 
            className={activeTab === "live" ? "active" : ""} 
            onClick={() => setActiveTab("live")}
          >
            Live
          </button>

          <button 
            className={activeTab === "upcoming" ? "active" : ""} 
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>

          <button 
            className={activeTab === "completed" ? "active" : ""} 
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>

        {/* ✅ Dynamic Cards */}
        <div className="row g-4">
          {matchData[activeTab].map((match, index) => (
            <div className="col-md-6 col-lg-4" key={index}>

              {activeTab === "live" && (
                <MatchCard match={match} />
              )}

              {activeTab === "upcoming" && (
                <div className="match-card">
                  <h6>{match.teamA} vs {match.teamB}</h6>
                  <p>{match.time}</p>
                </div>
              )}

              {activeTab === "completed" && (
                <div className="match-card">
                  <h6>{match.teamA} vs {match.teamB}</h6>
                  <p>{match.result}</p>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-4">
          <button 
            className="btn btn-primary"
            onClick={() => alert(`Showing all ${activeTab} matches`)}
          >
            View All Matches
          </button>
        </div>

      </div>
    </section>
  );
}

export default LiveMatches;