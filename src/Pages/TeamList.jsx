import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getUserTeams } from "../Services/teamService";
import {
  FaUsers,
  FaPlus,
  FaEye,
  FaSearch,
} from "react-icons/fa";
import "../assets/Styles/Global.css";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadTeams();
  }, [user]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = user ? await getUserTeams() : [];
      setTeams(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER + SEARCH
  const filteredTeams = teams.filter((team) =>
    team.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === "active") return "badge bg-success";
    if (status === "upcoming") return "badge bg-warning text-dark";
    return "badge bg-secondary";
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-90">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <FaUsers className="me-2" />
            My Teams ({filteredTeams.length})
          </h2>

          {/* ✅ NAVIGATE TO CREATE TEAM PAGE */}
          <button
            className="btn btn-success"
            onClick={() => navigate("/create-team")}
          >
            <FaPlus className="me-2" />
            Create Team
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
            <button
              className="btn btn-sm btn-light ms-2"
              onClick={loadTeams}
            >
              Retry
            </button>
          </div>
        )}

        {/* SEARCH */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search teams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TEAMS GRID */}
        <div className="row g-4">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-5">
              <h4>No teams found</h4>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/create-team")}
              >
                Create Team
              </button>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div key={team._id} className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">

                    {/* Header */}
                    <div className="d-flex justify-content-between mb-2">
                      <h5>{team.name}</h5>
                      <span className={getStatusBadge(team.status)}>
                        {team.status || "active"}
                      </span>
                    </div>

                    {/* Match Info */}
                    <p className="text-muted small">
                      {team.match?.name || "Match Info"}
                    </p>

                    {/* Stats */}
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <small>Points</small>
                        <div>{team.points || 0}</div>
                      </div>
                      <div>
                        <small>Players</small>
                        <div>{team.players?.length || 0}/11</div>
                      </div>
                    </div>

                    {/* Captain */}
                    <div className="mb-3 text-center">
                      <small className="text-muted">Captain</small>
                      <div className="fw-bold">
                        {team.captain?.name || "Not selected"}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="d-grid">
                      <Link
                        to={`/teams/${team._id}`}
                        className="btn btn-primary"
                      >
                        <FaEye className="me-2" />
                        View Team
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default TeamList;