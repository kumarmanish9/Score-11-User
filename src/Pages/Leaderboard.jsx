import React, { useState, useEffect } from "react";
import { getLeaderboard, getBatsmanLeaderboard, getBowlerLeaderboard, getTeamLeaderboard } from "../Services/leaderboardService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .leaderboard-container {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
    min-height: 100vh;
    padding: 60px 0;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 50px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #111 0%, #f5c500 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: #666;
    max-width: 500px;
    margin: 0 auto;
  }

  /* Tabs */
  .tabs-container {
    background: white;
    border-radius: 20px;
    padding: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    margin-bottom: 30px;
  }

  .tab-btn {
    background: transparent;
    border: none;
    padding: 14px 24px;
    font-weight: 700;
    font-size: 15px;
    color: #666;
    transition: all 0.2s ease;
    border-radius: 16px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.3px;
  }

  .tab-btn:hover {
    color: #111;
    background: #f5f5f5;
  }

  .tab-btn.active {
    background: #111;
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  /* Table Card */
  .table-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02);
    overflow: hidden;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .leaderboard-table thead th {
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    color: white;
    padding: 18px 20px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: none;
  }

  .leaderboard-table thead th:first-child {
    border-radius: 20px 0 0 0;
  }

  .leaderboard-table thead th:last-child {
    border-radius: 0 20px 0 0;
  }

  .leaderboard-table tbody tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
  }

  .leaderboard-table tbody tr:hover {
    background: #fafafa;
    transform: scale(1.01);
  }

  .leaderboard-table tbody td {
    padding: 16px 20px;
    vertical-align: middle;
    font-size: 14px;
    color: #333;
  }

  /* Rank Styles */
  .rank-cell {
    width: 80px;
  }

  .rank-number {
    font-size: 24px;
    font-weight: 800;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 12px;
  }

  .rank-1 .rank-number {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #111;
    box-shadow: 0 2px 8px rgba(255,215,0,0.3);
  }

  .rank-2 .rank-number {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
    color: #111;
  }

  .rank-3 .rank-number {
    background: linear-gradient(135deg, #cd7f32, #e8a866);
    color: #111;
  }

  .rank-other .rank-number {
    background: #f5f5f5;
    color: #999;
  }

  /* Player Info */
  .player-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .player-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f5c500, #ff9a00);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
  }

  .player-details {
    flex: 1;
  }

  .player-name {
    font-weight: 800;
    font-size: 16px;
    color: #111;
    margin-bottom: 4px;
  }

  .player-team {
    font-size: 12px;
    color: #999;
    font-weight: 500;
  }

  /* Stats */
  .stat-value {
    font-weight: 800;
    font-size: 18px;
    color: #111;
  }

  .stat-label {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
  }

  .points-value {
    font-weight: 800;
    font-size: 22px;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Medal Icons */
  .medal {
    font-size: 20px;
    margin-right: 8px;
  }

  /* Loading Spinner */
  .spinner-container {
    text-align: center;
    padding: 80px 20px;
  }

  .custom-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #f0f0f0;
    border-top-color: #f5c500;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .leaderboard-container {
      padding: 30px 0;
    }
    .hero-title {
      font-size: 2rem;
    }
    .tab-btn {
      padding: 10px 16px;
      font-size: 12px;
    }
    .leaderboard-table thead th,
    .leaderboard-table tbody td {
      padding: 12px 12px;
    }
    .player-name {
      font-size: 14px;
    }
    .points-value {
      font-size: 18px;
    }
    .rank-number {
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
    }
  }
`;

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab]);

  const loadLeaderboard = async (tab) => {
    setLoading(true);
    try {
      let data;
      switch (tab) {
        case 'overall':
          data = await getLeaderboard();
          break;
        case 'batsmen':
          data = await getBatsmanLeaderboard();
          break;
        case 'bowlers':
          data = await getBowlerLeaderboard();
          break;
        case 'teams':
          data = await getTeamLeaderboard();
          break;
        default:
          data = [];
      }
      setLeaderboardData(data);
    } catch (err) {
      console.error('Leaderboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overall', label: '🏆 Overall', icon: '🏆' },
    { id: 'batsmen', label: '🏏 Top Batsmen', icon: '🏏' },
    { id: 'bowlers', label: '🎯 Top Bowlers', icon: '🎯' },
    { id: 'teams', label: '👥 Top Teams', icon: '👥' },
  ];

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const getAvatarIcon = (tab, entry) => {
    if (tab === 'batsmen') return '🏏';
    if (tab === 'bowlers') return '🎯';
    if (tab === 'teams') return '👥';
    return '⭐';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="leaderboard-container">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section fade-in-up">
            <h1 className="hero-title">
              Leaderboard
            </h1>
            <p className="hero-subtitle">
              Top performers across the season
            </p>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="d-flex justify-content-center flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="table-card fade-in-up">
            {loading ? (
              <div className="spinner-container">
                <div className="custom-spinner"></div>
                <p className="text-muted">Loading leaderboard...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p className="text-muted mb-0">No data available for this leaderboard</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>{activeTab === 'teams' ? 'TEAM' : 'PLAYER'}</th>
                      <th>POINTS</th>
                      <th>MATCHES</th>
                      <th>AVERAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr key={entry._id || index} className={getRankClass(index)}>
                        <td className="rank-cell">
                          <div className="rank-number">
                            {getMedal(index) || `#${index + 1}`}
                          </div>
                        </td>
                        <td>
                          <div className="player-info">
                            <div className="player-avatar">
                              {getAvatarIcon(activeTab, entry)}
                            </div>
                            <div className="player-details">
                              <div className="player-name">
                                {entry.name || entry.teamName || entry.playerName}
                              </div>
                              <div className="player-team">
                                {entry.team?.name || entry.team?.shortName || entry.category || 
                                 (activeTab === 'batsmen' ? 'Batsman' : 
                                  activeTab === 'bowlers' ? 'Bowler' : 
                                  activeTab === 'teams' ? 'Team' : 'Player')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="points-value">
                            {entry.points?.toLocaleString() || entry.totalPoints?.toLocaleString() || 0}
                          </div>
                        </td>
                        <td>
                          <div className="stat-value">
                            {entry.matches || entry.games || entry.matchesPlayed || 0}
                          </div>
                          <div className="stat-label">Played</div>
                        </td>
                        <td>
                          <div className="stat-value">
                            {entry.average?.toFixed(1) || entry.avg?.toFixed(1) || entry.battingAvg?.toFixed(1) || entry.bowlingAvg?.toFixed(1) || '-'}
                          </div>
                          <div className="stat-label">
                            {activeTab === 'bowlers' ? 'Econ' : 'Avg'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats Summary for Top 3 */}
          {!loading && leaderboardData.length >= 3 && (
            <div className="row mt-4 g-3">
              <div className="col-md-4">
                <div className="bg-white p-3 rounded-3 text-center shadow-sm">
                  <div className="fs-1">🥇</div>
                  <div className="fw-bold">{leaderboardData[0]?.name || leaderboardData[0]?.teamName}</div>
                  <div className="text-success fw-bold">{leaderboardData[0]?.points || 0} points</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white p-3 rounded-3 text-center shadow-sm">
                  <div className="fs-1">🥈</div>
                  <div className="fw-bold">{leaderboardData[1]?.name || leaderboardData[1]?.teamName}</div>
                  <div className="text-success fw-bold">{leaderboardData[1]?.points || 0} points</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white p-3 rounded-3 text-center shadow-sm">
                  <div className="fs-1">🥉</div>
                  <div className="fw-bold">{leaderboardData[2]?.name || leaderboardData[2]?.teamName}</div>
                  <div className="text-success fw-bold">{leaderboardData[2]?.points || 0} points</div>
                </div>
              </div>
            </div>
          )}
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
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default Leaderboard;