import React, { useEffect, useState } from "react";
import "../Components/PagesCss/Matches.css";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getMatches } from "../Services/matchService";

function Matches() {
  const [activeTab, setActiveTab] = useState("live");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async (type) => {
    try {
      setLoading(true);
      const data = await getMatches(type);
      setMatches(data || []);
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  return (
    <div className="matches-page">

      <h2 className="page-title">Matches</h2>

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

      <div className="matches-container">
        {loading ? (
          <p className="loading">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="no-data">No matches found</p>
        ) : (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}

export default Matches;