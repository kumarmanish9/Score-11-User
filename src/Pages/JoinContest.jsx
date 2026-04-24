import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContests, joinContest } from "../Services/contestService";
import { getUserTeams } from "../Services/teamService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .join-container {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  .main-card {
    border-radius: 24px;
    background: white;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02);
    overflow: hidden;
  }

  .card-header-custom {
    background: white;
    border-bottom: 2px solid #f0f0f0;
    padding: 24px 28px;
  }

  .back-btn {
    background: transparent;
    border: 1.5px solid #e5e5e5;
    border-radius: 14px;
    padding: 8px 20px;
    font-weight: 600;
    font-size: 14px;
    color: #666;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .back-btn:hover {
    background: #f5f5f5;
    border-color: #ccc;
    transform: translateX(-2px);
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title::before {
    content: '';
    width: 4px;
    height: 20px;
    background: #f5c500;
    border-radius: 2px;
    display: inline-block;
  }

  .contest-card {
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 2px solid transparent;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .contest-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }

  .contest-card.selected {
    border-color: #f5c500;
    background: linear-gradient(135deg, #fffdf5 0%, #fff 100%);
    box-shadow: 0 8px 20px rgba(245,197,0,0.15);
  }

  .selected-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #f5c500;
    color: #111;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    z-index: 1;
  }

  .contest-name {
    font-size: 16px;
    font-weight: 800;
    color: #111;
    margin-bottom: 12px;
    padding-right: 60px;
  }

  .spots-badge {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 700;
    display: inline-block;
  }

  .spots-badge.warning {
    background: #fff3e0;
    color: #e65100;
  }

  .entry-fee {
    font-size: 20px;
    font-weight: 800;
    color: #111;
  }

  .prize-pool {
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }

  .team-card {
    border-radius: 16px;
    transition: all 0.2s ease;
    cursor: pointer;
    border: 2px solid transparent;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 12px;
  }

  .team-card:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .team-card.selected {
    border-color: #16a34a;
    background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%);
  }

  .team-selected-badge {
    background: #16a34a;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .team-name {
    font-size: 15px;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
  }

  .player-count {
    font-size: 12px;
    font-weight: 700;
    color: #16a34a;
  }

  .join-btn {
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    border: none;
    border-radius: 20px;
    padding: 16px 40px;
    font-weight: 800;
    font-size: 16px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    min-width: 280px;
  }

  .join-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
  }

  .join-btn:disabled {
    background: #e5e5e5;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    background: #fafafa;
    border-radius: 20px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .loading-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    .join-container {
      padding: 20px 0;
    }
    .card-header-custom {
      padding: 16px 20px;
      flex-direction: column;
      gap: 12px;
      align-items: flex-start !important;
    }
    .join-btn {
      width: 100%;
      min-width: auto;
    }
  }
`;

function JoinContest() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [contestsData, teamsData] = await Promise.all([
        getContests(),
        getUserTeams()
      ]);
      setContests(contestsData.slice(0, 12));
      setTeams(teamsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleJoin = async () => {
    if (!selectedContest || !selectedTeam) {
      alert("Please select both a contest and a team to join");
      return;
    }

    try {
      setLoading(true);
      await joinContest(selectedContest._id, selectedTeam._id);
      alert("✅ Successfully joined contest!");
      navigate("/my-teams");
    } catch (err) {
      console.error("Join error:", err);
      alert("❌ Error joining contest. Please check your entry fee and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSpotsClass = (spotsLeft, totalSpots) => {
    const percentage = (spotsLeft / totalSpots) * 100;
    if (percentage < 20) return "warning";
    return "";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="join-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="main-card">
                {/* Header */}
                <div className="card-header-custom d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold" style={{ color: '#111' }}>
                    Join Contest
                  </h2>
                  <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back to Dashboard
                  </button>
                </div>

                <div className="p-4 p-lg-5">
                  {fetching ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" style={{ width: '50px', height: '50px' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mt-3">Loading contests and teams...</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {/* Contests Column */}
                      <div className="col-lg-8">
                        <div className="section-title">
                          Featured Contests
                        </div>
                        {contests.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-icon">🏏</div>
                            <p className="text-muted mb-0">No contests available at the moment</p>
                          </div>
                        ) : (
                          <div className="row g-3">
                            {contests.map((contest, index) => (
                              <div key={contest._id} className="col-md-6">
                                <div 
                                  className={`contest-card p-4 ${selectedContest?._id === contest._id ? 'selected' : ''}`}
                                  onClick={() => setSelectedContest(contest)}
                                  style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeInUp 0.5s ease-out' }}
                                >
                                  {selectedContest?._id === contest._id && (
                                    <div className="selected-badge">✓ SELECTED</div>
                                  )}
                                  <div className="contest-name">
                                    {contest.name || 'Grand League'}
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className={`spots-badge ${getSpotsClass(contest.spotsLeft || 0, contest.totalSpots || 10000)}`}>
                                      🎯 {contest.spotsLeft || 0}/{contest.totalSpots || 10000} spots
                                    </span>
                                    <span className="entry-fee">
                                      ₹{contest.entryFee || 0}
                                    </span>
                                  </div>
                                  <div className="prize-pool mb-2">
                                    🏆 Prize Pool: ₹{(contest.prizePool || 100000).toLocaleString()}
                                  </div>
                                  <div className="prize-pool">
                                    📅 {contest.match?.team1} vs {contest.match?.team2}
                                  </div>
                                  <div className="mt-3">
                                    <div className="progress" style={{ height: '4px', borderRadius: '2px', background: '#f0f0f0' }}>
                                      <div 
                                        className="progress-bar" 
                                        style={{ 
                                          width: `${((contest.totalSpots - contest.spotsLeft) / contest.totalSpots) * 100}%`,
                                          background: '#f5c500',
                                          borderRadius: '2px'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Teams Column */}
                      <div className="col-lg-4">
                        <div className="section-title">
                          My Teams
                          <span className="ms-2 px-2 py-1 bg-light rounded" style={{ fontSize: '13px', color: '#666' }}>
                            {teams.length}
                          </span>
                        </div>
                        {teams.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <p className="text-muted mb-2">No teams created yet</p>
                            <button 
                              className="btn btn-sm btn-outline-primary mt-2"
                              onClick={() => navigate("/create-team")}
                            >
                              Create Your First Team →
                            </button>
                          </div>
                        ) : (
                          <div className="teams-list">
                            {teams.map((team) => (
                              <div 
                                key={team._id} 
                                className={`team-card p-3 ${selectedTeam?._id === team._id ? 'selected' : ''}`}
                                onClick={() => setSelectedTeam(team)}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div className="team-name">{team.name}</div>
                                  {selectedTeam?._id === team._id && (
                                    <div className="team-selected-badge">Selected</div>
                                  )}
                                </div>
                                <div className="prize-pool mb-2">
                                  {team.match?.team1} vs {team.match?.team2}
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="player-count">
                                    {team.players?.length || 0}/11 Players
                                  </div>
                                  {team.captain && (
                                    <div className="prize-pool">
                                      <span className="text-warning">C:</span> {team.captain.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Join Button */}
                  <div className="text-center mt-5 pt-4 border-top">
                    <button 
                      className="join-btn btn"
                      onClick={handleJoin}
                      disabled={loading || !selectedContest || !selectedTeam || fetching}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Joining Contest...
                        </>
                      ) : (
                        `Join Contest - ₹${selectedContest?.entryFee || 0}`
                      )}
                    </button>
                    {!selectedContest && !selectedTeam && !fetching && (
                      <p className="text-muted mt-3 small">
                        Select a contest and a team to join
                      </p>
                    )}
                    {selectedContest && !selectedTeam && !fetching && (
                      <p className="text-muted mt-3 small">
                        Select a team to join this contest
                      </p>
                    )}
                    {!selectedContest && selectedTeam && !fetching && (
                      <p className="text-muted mt-3 small">
                        Select a contest to join with {selectedTeam.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
}

export default JoinContest;