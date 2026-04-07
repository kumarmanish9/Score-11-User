import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserTeams } from "../Services/teamService";
import "../assets/Styles/Global.css";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserTeams();
      setTeams(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter teams based on tab
  const filteredTeams =
    activeTab === "all"
      ? teams
      : teams.filter((team) =>
          team.status?.toLowerCase().includes(activeTab)
        );

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-3">My Teams</h1>
            <p className="lead text-gray-700 mb-0">
              Manage your fantasy teams across all contests and matches.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/contests" className="btn btn-primary btn-lg px-5">
              Create New Team
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-warning text-center mb-5">
            {error}
            <button
              className="btn btn-sm btn-outline-primary ms-2"
              onClick={fetchTeams}
            >
              Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group w-100" role="group">
              <button
                className={`btn btn-lg fw-semibold flex-fill ${
                  activeTab === "active"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active (
                {teams.filter((t) => t.status === "Active").length})
              </button>

              <button
                className={`btn btn-lg fw-semibold flex-fill ${
                  activeTab === "upcoming"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming (
                {teams.filter((t) => t.status === "Upcoming").length})
              </button>

              <button
                className={`btn btn-lg fw-semibold flex-fill ${
                  activeTab === "completed"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed (
                {teams.filter((t) => t.status === "Completed").length})
              </button>

              <button
                className={`btn btn-lg fw-semibold flex-fill ${
                  activeTab === "all"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All ({teams.length})
              </button>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="row g-4">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div key={team._id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title fw-bold mb-1">
                          {team.name}
                        </h5>
                        <small className="text-muted">
                          {team.match?.name || "Match Info"}
                        </small>
                      </div>

                      <span
                        className={`badge px-3 py-2 ${
                          team.status === "Active"
                            ? "bg-success"
                            : team.status === "Upcoming"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {team.status}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mb-4">
                      <div className="row text-center">
                        <div className="col-4">
                          <div className="text-muted">Points</div>
                          <div className="fw-bold text-primary">
                            {team.points || 0}
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="text-muted">Players</div>
                          <div className="text-success">
                            {team.players?.length || 0}/11
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="text-muted">Rank</div>
                          <div className="fw-bold">
                            {team.rank || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Captain */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <small className="text-muted d-block text-center mb-2">
                        Captain
                      </small>

                      <div className="text-center fw-semibold">
                        {team.captain?.name || "Not Selected"}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="d-grid gap-2">
                      <Link
                        to={`/teams/${team._id}`}
                        className="btn btn-primary"
                      >
                        Edit Team
                      </Link>

                      <Link
                        to={`/matches/${team.match?._id}`}
                        className="btn btn-outline-primary"
                      >
                        View Match
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h3>No teams yet</h3>
              <p className="text-muted">
                Create your first fantasy team and start winning!
              </p>
              <Link to="/contests" className="btn btn-primary">
                Create Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTeams;