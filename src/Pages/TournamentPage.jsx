import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getMatches } from "../Services/matchService";

function TournamentPage() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("live");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches(activeTab, id);
      setMatches(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [activeTab, id]);

  return (
    <div className="container mt-4">

      {/* 🔥 HEADER */}
      <div
        className="d-flex justify-content-between align-items-center p-4 mb-4"
        style={{
          backgroundColor: "rgb(45,110,239)",
          color: "white",
          borderRadius: "12px",
        }}
      >
        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "white",
              color: "rgb(45,110,239)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            🏏
          </div>

          <div>
            <h3 className="mb-1">
              {matches[0]?.tournament?.name || "Tournament"}
            </h3>
            <p className="mb-1">Noida • 1357 Views</p>
            <p className="mb-2">09-04-2026 to 10-05-2026</p>

            <button className="btn btn-light btn-sm">
              Contact Us
            </button>
          </div>
        </div>

        {/* RIGHT STATS */}
        <div className="d-flex gap-3">
          <div
            className="text-center p-3"
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              minWidth: "120px",
            }}
          >
            <h4>{matches.length}</h4>
            <p className="mb-0">Matches</p>
          </div>

          <div
            className="text-center p-3"
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              minWidth: "120px",
            }}
          >
            <h4>7</h4>
            <p className="mb-0">Teams</p>
          </div>
        </div>
      </div>

      {/* 🔥 TOP NAV (Matches, Points, etc.) */}
      <div className="d-flex gap-4 border-bottom pb-2 mb-3">
        {[
          "Matches",
          "Leaderboard",
          "Points Table",
          "Stats",
          "Teams",
        ].map((item, index) => (
          <span
            key={index}
            style={{
              cursor: "pointer",
              fontWeight: item === "Matches" ? "bold" : "normal",
              color:
                item === "Matches" ? "rgb(45,110,239)" : "#555",
              borderBottom:
                item === "Matches"
                  ? "2px solid rgb(45,110,239)"
                  : "none",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* 🔥 FILTER TABS (Live, Upcoming, Completed) */}
      <div className="d-flex gap-2 mb-3">
        {["live", "upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            className="btn btn-sm"
            style={{
              backgroundColor:
                activeTab === tab
                  ? "rgb(45,110,239)"
                  : "#f1f3f5",
              color:
                activeTab === tab ? "white" : "#333",
              borderRadius: "20px",
              padding: "5px 15px",
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔥 MATCH LIST */}
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : matches.length === 0 ? (
          <p>No matches found</p>
        ) : (
          matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))
        )}
      </div>

    </div>
  );
}

export default TournamentPage;