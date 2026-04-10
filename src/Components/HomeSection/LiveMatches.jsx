import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LiveMatches.css";
import MatchCard from "../Cards/MatchCard";
import { getLiveMatches, getUpcomingMatches } from "../../Services/dashboardService";
import { getMatches } from "../../Services/matchService";
import { getPublicTeam } from "../../Services/teamService";

function LiveMatches({ live = [], upcoming = [], refresh }) {
  const [activeTab, setActiveTab] = useState("live");
  const [localLoading, setLocalLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState(live || []);
  const [upcomingMatches, setUpcomingMatches] = useState(upcoming || []);
  const [completedMatches, setCompletedMatches] = useState([]);

  // ✅ SAFE TEAM NAME FUNCTION
  const getTeamName = (team) => {
    if (!team) return "Team";
    if (typeof team === "string") return team; // fallback if still ID
    return team.shortName || team.name || "Team";
  };

  // ✅ WINNER NAME
  const getWinnerName = (match) => {
    if (match?.result?.winnerName) return match.result.winnerName;

    const winner = match?.result?.winner;

    if (!winner) return "";

    if (typeof winner === "object") {
      return getTeamName(winner);
    }

    // fallback (if still ID)
    if (winner === match?.team1?._id) return getTeamName(match.team1);
    if (winner === match?.team2?._id) return getTeamName(match.team2);

    return winner;
  };

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLocalLoading(true);

        const [liveData, upcomingData, completedData] = await Promise.all([
          getLiveMatches().catch(() => []),
          getUpcomingMatches().catch(() => []),
          getMatches("completed").catch(() => []),
        ]);

        if (!mounted) return;

        setLiveMatches(
          live && live.length ? live : Array.isArray(liveData) ? liveData : []
        );

        setUpcomingMatches(
          upcoming && upcoming.length
            ? upcoming
            : Array.isArray(upcomingData)
            ? upcomingData
            : []
        );

        let completed = Array.isArray(completedData)
          ? completedData
          : [];

        // ✅ 🔥 FIX: Convert team IDs → team objects
        const resolvedMatches = await Promise.all(
          completed.map(async (match) => {
            try {
              let team1 = match.team1;
              let team2 = match.team2;

              // Fetch team1 if it's ID
              if (typeof team1 === "string") {
                const t1 = await getPublicTeam(team1).catch(() => null);
                if (t1) team1 = t1;
              }

              // Fetch team2 if it's ID
              if (typeof team2 === "string") {
                const t2 = await getPublicTeam(team2).catch(() => null);
                if (t2) team2 = t2;
              }

              return {
                ...match,
                team1,
                team2,
              };
            } catch (err) {
              console.error("Team fetch error:", err);
              return match;
            }
          })
        );

        setCompletedMatches(resolvedMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        if (mounted) {
          setLiveMatches(live || []);
          setUpcomingMatches(upcoming || []);
          setCompletedMatches([]);
        }
      } finally {
        if (mounted) setLocalLoading(false);
      }
    };

    fetchAll();

    return () => (mounted = false);
  }, [live, upcoming, refresh]);

  if (localLoading) {
    return (
      <section className="live-section">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      </section>
    );
  }

  const dataForTab =
    activeTab === "live"
      ? liveMatches
      : activeTab === "upcoming"
      ? upcomingMatches
      : completedMatches;

  return (
    <section className="live-section">
      <div className="container">

        <h2 className="section-title">Matches</h2>

        {/* Tabs */}
        <div className="tabs mb-4">
          <button
            className={activeTab === "live" ? "active" : ""}
            onClick={() => setActiveTab("live")}
          >
            Live ({liveMatches.length})
          </button>

          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({upcomingMatches.length})
          </button>

          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedMatches.length})
          </button>
        </div>

        {/* Match Cards */}
        <div className="row g-4">
          {dataForTab.length === 0 ? (
            <div className="col-12 text-center py-5">
              <h5>No {activeTab} matches</h5>
            </div>
          ) : (
            dataForTab.map((match, index) => (
              <div className="col-md-6 col-lg-4" key={match._id || index}>
                {activeTab === "live" ? (
                  <MatchCard match={match} />
                ) : (
                  <div className="card h-100">
                    <div className="card-body text-center">

                      {/* Teams */}
                      <h5>
                        {getTeamName(match.team1)} vs{" "}
                        {getTeamName(match.team2)}
                      </h5>

                      {/* Result */}
                      {match.result && (
                        <p className="text-success fw-bold">
                          {getWinnerName(match)}{" "}
                          {match.result.margin
                            ? `won by ${match.result.margin}`
                            : ""}
                        </p>
                      )}

                      {/* Date */}
                      {match.scheduledDate && (
                        <p className="text-muted">
                          {new Date(match.scheduledDate).toDateString()}
                        </p>
                      )}

                      {/* Button */}
                      <Link
                        to={`/match/${match._id}`}
                        className="btn btn-primary btn-sm mt-2"
                      >
                        View Details
                      </Link>

                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* View All */}
        <div className="text-center mt-5">
          <Link to="/matches" className="btn btn-primary">
            View All Matches →
          </Link>
        </div>

      </div>
    </section>
  );
}

export default LiveMatches;