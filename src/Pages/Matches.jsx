import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../Components/PagesCss/Matches.css";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getMatches } from "../Services/matchService";

function Matches() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "live";
  const [activeTab, setActiveTab] = useState(initialTab);
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

  // update tab when query param changes
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("tab") || "live";
    if (p !== activeTab) setActiveTab(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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
            <MatchCard key={match._id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}

export default Matches;