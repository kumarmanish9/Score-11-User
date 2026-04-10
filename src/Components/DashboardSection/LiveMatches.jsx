import React, { useEffect, useState } from "react";
import "./LiveMatches.css";
import { getLiveMatches } from "../../Services/dashboardService";
import { Link } from "react-router-dom";

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getLiveMatches();
        if (!mounted) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching live matches:", err);
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, []);

  return (
    <section className="live-section">
      <div className="section-header">
        <h2>🔥 Live Matches</h2>
        <Link to="/matches?tab=live" className="view-all">View All →</Link>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading live matches...</div>
      ) : (
        <div className="match-list">
          {matches.length ? (
            matches.map((match, index) => {
              const t1 = match.team1?.shortName || match.team1?.name || match.team1 || (match.teams && match.teams[0]) || "Team 1";
              const t2 = match.team2?.shortName || match.team2?.name || match.team2 || (match.teams && match.teams[1]) || "Team 2";
              const score = match.score || match.liveScore || match.summary || "";
              return (
                <div className="match-card" key={match._id || index}>
                  <div className="match-top">
                    <span className="live-badge">LIVE</span>
                  </div>

                  <div className="teams">
                    <h3>{t1}</h3>
                    <span>vs</span>
                    <h3>{t2}</h3>
                  </div>

                  <p className="score">{score}</p>
                </div>
              );
            })
          ) : (
            <div className="text-muted">No live matches right now.</div>
          )}
        </div>
      )}
    </section>
  );
}

export default LiveMatches;