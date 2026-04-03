import React, { useState, useEffect } from "react";
import { getPlayers } from "../../Services/playerService";
import LeaderboardCard from "./LeaderboardCard";
import "./Leaderboard.css";

function Leaderboard({ streams = [] }) {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [mvps, setMvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const players = await getPlayers();
      // Simple categorization - use real backend fields in production
      const topBatsmen = players.slice(0, 3).map(p => ({ name: p.name || p.fullName, score: `${p.runs || 0} Runs` }));
      const topBowlers = players.slice(3, 6).map(p => ({ name: p.name || p.fullName, score: `${p.wickets || 0} Wickets` }));
      const topMvps = players.slice(6, 9).map(p => ({ name: p.name || p.fullName, score: `${p.points || 0} Points` }));
      
      setBatsmen(topBatsmen);
      setBowlers(topBowlers);
      setMvps(topMvps);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="leaderboard-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading leaderboard...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="leaderboard-section py-5 bg-gradient-green text-white">
      <div className="container">
        <div className="text-center mb-5 fade-in-up">
          <h2 className="section-title mb-3">Leaderboard</h2>
          <p className="lead">Top performers of the season</p>
        </div>

        <div className="leaderboard-grid row g-4">
          <LeaderboardCard title="🏏 Top Batsmen" data={batsmen} />
          <LeaderboardCard title="🎯 Top Bowlers" data={bowlers} />
          <LeaderboardCard title="⭐ MVP" data={mvps} />
        </div>

        {streams.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center mb-4">Live Streams ({streams.length})</h3>
              <div className="row g-3">
                {streams.slice(0, 3).map((stream, index) => (
                  <div className="col-md-4" key={stream._id || index}>
                    <div className="card h-100 border-0 shadow hover-lift">
                      <div className="card-body">
                        <h6>{stream.title || 'Live Match'}</h6>
                        <p className="small text-muted mb-2">{stream.viewerCount || 0} viewers</p>
                        <a href={`/live/${stream._id || index}`} className="btn btn-sm btn-primary">Watch Live</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-5">
          <a href="/live" className="btn btn-light btn-lg">
            View Complete Leaderboard →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;
