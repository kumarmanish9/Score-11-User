import React, { useState, useEffect } from "react";
import "./LiveMatches.css";
import MatchCard from "./MatchCard";

function LiveMatches({ live = [], upcoming = [], refresh }) {
  const [activeTab, setActiveTab] = useState("live");
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (live.length || upcoming.length) {
      setLocalLoading(false);
    }
  }, [live, upcoming]);

  if (localLoading) {
    return (
      <section className="live-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading matches...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="live-section">
      <div className="container">

        {/* Title */}
        <h2 className="section-title fade-in-up">Live Matches</h2>

        {/* Tabs */}
        <div className="tabs mb-4">
          <button 
            className={`tab-btn ${activeTab === "live" ? "active" : ""}`} 
            onClick={() => setActiveTab("live")}
          >
            Live ({live.length})
          </button>

          <button 
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`} 
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({upcoming.length})
          </button>

          <button 
            className={`tab-btn ${activeTab === "completed" ? "active" : ""}`} 
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>

        {/* Dynamic Cards */}
        <div className="row g-4">
          {(() => {
            const data = activeTab === 'live' ? live : activeTab === 'upcoming' ? upcoming : [];
            if (data.length === 0) {
              return (
                <div className="col-12 text-center py-5">
                  <h5>No {activeTab} matches at the moment</h5>
                  <p className="text-muted">Check back soon!</p>
                </div>
              );
            }
            return data.map((match, index) => (
              <div className="col-md-6 col-lg-4" key={match._id || index}>
                {activeTab === "live" ? (
                  <MatchCard match={match} />
                ) : (
                  <div className="card h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">{match.teamA || 'Team A'}</span>
                        <span className="text-muted">vs</span>
                        <span className="fw-bold">{match.teamB || 'Team B'}</span>
                      </div>
                      {match.time && <p className="card-text mb-0">{match.time}</p>}
                      {match.result && <p className="card-text text-success fw-bold mb-0">{match.result}</p>}
                    </div>
                  </div>
                )}
              </div>
            ));
          })()}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5">
          <a href="/matches" className="btn btn-primary btn-lg">
            View All Matches →
          </a>
        </div>

      </div>
    </section>
  );
}

export default LiveMatches;
