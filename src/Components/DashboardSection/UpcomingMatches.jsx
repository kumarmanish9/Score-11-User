import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UpcomingMatches.css";
import { getUpcomingMatches } from "../../Services/dashboardService";

function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingMatches();
        if (!mounted) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching upcoming matches:", err);
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, []);

  return (
    <section className="upcoming-section">
      <div className="section-header">
        <h2>📅 Upcoming Matches</h2>
        <Link to="/matches?tab=upcoming" className="view-all">View All →</Link>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading upcoming matches...</div>
      ) : (
        <div className="upcoming-list">
          {matches.length ? (
            matches.map((match, index) => {
              const t1 = match.team1?.shortName || match.team1?.name || match.team1 || (match.teams && match.teams[0]) || "Team 1";
              const t2 = match.team2?.shortName || match.team2?.name || match.team2 || (match.teams && match.teams[1]) || "Team 2";
              const date = match.date || match.startDate || match.start || match.kickoff || "";
              const time = match.time || match.startTime || match.kickoffTime || "";

              return (
                <div className="upcoming-card" key={match._id || index}>
                  <div className="teams">
                    <span>{t1}</span>
                    <span className="vs">vs</span>
                    <span>{t2}</span>
                  </div>

                  <div className="match-info">
                    <span>{date}</span>
                    <span>{time}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-muted">No upcoming matches.</div>
          )}
        </div>
      )}
    </section>
  );
}

export default UpcomingMatches;