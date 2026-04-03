import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContests, joinContest } from "../Services/contestService";
import { getUserTeams } from "../Services/teamService";
import "../assets/Styles/Global.css";

function JoinContest() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contestsData, teamsData] = await Promise.all([
        getContests(),
        getUserTeams()
      ]);
      setContests(contestsData.slice(0, 12)); // Featured contests
      setTeams(teamsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleJoin = async () => {
    if (!selectedContest || !selectedTeam) {
      alert("Select contest and team");
      return;
    }

    try {
      setLoading(true);
      await joinContest(selectedContest._id);
      alert("Successfully joined contest!");
      navigate("/my-teams");
    } catch (err) {
      console.error("Join error:", err);
      alert("Error joining contest. Check entry fee and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Join Contest</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Back to Dashboard
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Contests Column */}
                  <div className="col-lg-8">
                    <h5 className="fw-bold text-gray-900 mb-4">Featured Contests</h5>
                    <div className="row g-4">
                      {contests.map((contest) => (
                        <div key={contest._id} className="col-md-6 col-lg-6">
                          <div 
                            className={`card h-100 hover-lift cursor-pointer p-4 border-0 shadow-sm ${selectedContest?._id === contest._id ? 'border-primary shadow-md bg-primary-subtle' : ''}`}
                            onClick={() => setSelectedContest(contest)}
                          >
                            <div className="position-relative">
                              {selectedContest?._id === contest._id && (
                                <span className="position-absolute top-0 start-0 badge bg-primary m-2">Selected</span>
                              )}
                              <h6 className="fw-bold mb-2 text-gray-900">
                                {contest.name || 'Grand League'}
                              </h6>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="badge bg-success fs-6 px-3 py-2">
                                  Spots: {contest.spotsLeft || 0}/{contest.totalSpots || 10000}
                                </span>
                                <span className="fw-bold text-success fs-5">
                                  ₹{contest.entryFee || 0}
                                </span>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted">Prize: ₹{(contest.prizePool || 100000).toLocaleString()}</small>
                              </div>
                              <small className="text-muted">Match: {contest.match?.team1} vs {contest.match?.team2}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teams Column */}
                  <div className="col-lg-4">
                    <h5 className="fw-bold text-gray-900 mb-4">My Teams ({teams.length})</h5>
                    {teams.map((team) => (
                      <div 
                        key={team._id} 
                        className={`card mb-3 p-3 hover-lift cursor-pointer border-0 shadow-sm ${selectedTeam?._id === team._id ? 'border-success shadow-md bg-success-subtle' : ''}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="d-flex align-items-center">
                          {selectedTeam?._id === team._id && (
                            <span className="badge bg-success me-2">Selected</span>
                          )}
                          <h6 className="mb-1 fw-semibold">{team.name}</h6>
                        </div>
                        <small className="text-muted d-block mb-2">
                          {team.match?.team1} vs {team.match?.team2}
                        </small>
                        <div className="text-success fw-bold">
                          {team.players?.length || 0}/11 Players
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join Button */}
                <div className="text-center mt-5 pt-4 border-top">
                  <button 
                    className="btn btn-success btn-lg px-5 py-3 shadow-lg" 
                    onClick={handleJoin}
                    disabled={loading || !selectedContest || !selectedTeam}
                    style={{minWidth: '250px'}}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Joining...
                      </>
                    ) : (
                      `Join Contest - ₹${selectedContest?.entryFee || 0}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinContest;
