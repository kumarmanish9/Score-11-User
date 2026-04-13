import React, { useEffect, useState } from "react";
import "../Components/PagesCss/Matches.css";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getMatches } from "../Services/matchService";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches("live"); // हमेशा live ही call होगा
      setMatches(data || []);
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="matches-page">

      <h2 className="page-title">Live Matches</h2>

      <div className="matches-container">
        {loading ? (
          <p className="loading">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="no-data">No live matches found</p>
        ) : (
          matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}

export default Matches;